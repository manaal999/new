
package main 
import "fmt"
type student struct {
	Name string
	Reg_num float32
	Dept string
}
func main (){
	st:=student{Name:"xyz",Reg_num:123,Dept:"abc"}
	fmt.Println("Name:",st.name,"\nreg no:",st.Reg_num,"\ndept",st.Dept)
}