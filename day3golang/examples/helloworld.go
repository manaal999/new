
package main 
import "fmt"
func main (){
     ifelseDemo()
}
func ifelseDemo(){
    var age int
    fmt.Scanln(&age)
    if age>18{
        fmt.Println("adult")
    } else{
        fmt.Println("minor")
    }
}
