package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Config
var mongoUri string = "mongodb://localhost:27017"
var mongoDbName string = "student_system_db"
var mongoCollectionStudent string = "students"

// Database variables
var mongoclient *mongo.Client
var studentCollection *mongo.Collection

// Model Student for Collection "students"
type Student struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name       string             `json:"name" bson:"name"`
	Email      string             `json:"email" bson:"email"`
	Department string             `json:"department" bson:"department"`
}

// Connect to MongoDB
func connectDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var err error
	mongoclient, err = mongo.Connect(ctx, options.Client().ApplyURI(mongoUri))
	if err != nil {
		log.Fatal("MongoDB Connection Error:", err)
	}

	studentCollection = mongoclient.Database(mongoDbName).Collection(mongoCollectionStudent)
	fmt.Println("Connected to MongoDB!")
}

// POST /students
func createStudent(c *gin.Context) {
	var jbodyStudent Student

	// Bind JSON body to jbodyStudent
	if err := c.BindJSON(&jbodyStudent); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Insert student into MongoDB
	result, err := studentCollection.InsertOne(ctx, jbodyStudent)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create student"})
		return
	}

	// Extract the inserted ID
	studentId, ok := result.InsertedID.(primitive.ObjectID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse inserted ID"})
		return
	}
	jbodyStudent.ID = studentId

	// Read the created student from MongoDB
	var createdStudent Student
	err = studentCollection.FindOne(ctx, bson.M{"_id": jbodyStudent.ID}).Decode(&createdStudent)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch created student"})
		return
	}

	// Return created student
	c.JSON(http.StatusCreated, gin.H{
		"message": "Student created successfully",
		"student": createdStudent,
	})
}

// GET /students
func readAllStudents(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := studentCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch students"})
		return
	}
	defer cursor.Close(ctx)

	// Ensure students is an empty slice, not nil
	students := []Student{}
	if err := cursor.All(ctx, &students); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse students"})
		return
	}

	c.JSON(http.StatusOK, students)
}

// GET /students/:id
func readStudentById(c *gin.Context) {
	id := c.Param("id")

	// Convert string ID to primitive.ObjectID
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var student Student
	err = studentCollection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&student)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
		return
	}

	c.JSON(http.StatusOK, student)
}

// PUT /students/:id
func updateStudent(c *gin.Context) {
	id := c.Param("id")
	// Convert string ID to primitive.ObjectID
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}
	var jbodyStudent Student

	if err := c.BindJSON(&jbodyStudent); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var oldStudent Student

	err = studentCollection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&oldStudent)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
		return
	}
	if jbodyStudent.Name != "" {
		oldStudent.Name = jbodyStudent.Name
	}
	if jbodyStudent.Email != "" {
		oldStudent.Email = jbodyStudent.Email
	}
	if jbodyStudent.Department != "" {
		oldStudent.Department = jbodyStudent.Department
	}

	result, err := studentCollection.UpdateOne(ctx, bson.M{"_id": objectID}, bson.M{"$set": oldStudent})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update student"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
		return
	}
	// Return updated student
	c.JSON(http.StatusOK, gin.H{
		"message": "Student updated successfully",
		"student": oldStudent,
	})
}

// DELETE /students/:id
func deleteStudent(c *gin.Context) {
	id := c.Param("id")
	// Convert string ID to primitive.ObjectID
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, errDelete := studentCollection.DeleteOne(ctx, bson.M{"_id": objectID})
	if errDelete != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete student"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Student deleted successfully"})
}

func main() {
	// Connect to MongoDB
	connectDB()

	// Set up Gin router
	r := gin.Default()
	// CORS Configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // React frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	// Routes
	r.POST("/students", createStudent)
	r.GET("/students", readAllStudents)
	r.GET("/students/:id", readStudentById)
	r.PUT("/students/:id", updateStudent)
	r.DELETE("/students/:id", deleteStudent)

	// Start server
	r.Run(":8080")
}
