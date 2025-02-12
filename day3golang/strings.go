package main

import "fmt"

func main() {
    forpythonstyle()
}

func forpythonstyle() {
    strings := []string{"hello", "world", "golang", "nie"} 
    for i, s := range strings { 
        fmt.Println(i, s)
    }
}
