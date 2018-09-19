package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/Karl-Gustav/flexitModbus"
	"github.com/gorilla/mux"
)

const (
	PORT = "8080"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", fileHandler("index.html")).Methods("GET")
	r.HandleFunc("/main.css", fileHandler("main.css")).Methods("GET")
	r.HandleFunc("/main.js", fileHandler("main.js")).Methods("GET")
	r.HandleFunc("/inputRegisters.js", fileHandler("inputRegisters.js")).Methods("GET")
	r.HandleFunc("/holdingRegisters.js", fileHandler("holdingRegisters.js")).Methods("GET")
	r.HandleFunc("/api/holdingregisters", getHoldingRegisters).Methods("GET")
	r.HandleFunc("/api/holdingregisters/{name}", getHoldingRegister).Methods("GET")
	r.HandleFunc("/api/holdingregisters/{name}", setHoldingRegister).Methods("PATCH", "PUT")
	r.HandleFunc("/api/inputregisters", getInputRegisters).Methods("GET")
	r.HandleFunc("/api/inputregisters/{name}", getInputRegister).Methods("GET")

	log.Println("Started server on port", PORT)
	http.ListenAndServe(":"+PORT, r)
}

func getInputRegister(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	register, err := flexitModbus.ReadInputRegister(vars["name"])
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	jstring, _ := json.Marshal(register)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jstring)
}

func getInputRegisters(w http.ResponseWriter, r *http.Request) {
	registers, err := flexitModbus.ReadAllInputRegisters()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	jstring, _ := json.Marshal(registers)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jstring)
}

func getHoldingRegister(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	register, err := flexitModbus.ReadHoldingRegister(vars["name"])
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	jstring, _ := json.Marshal(register)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jstring)
}

func getHoldingRegisters(w http.ResponseWriter, r *http.Request) {
	registers, err := flexitModbus.ReadAllHoldingRegisters()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	jstring, _ := json.Marshal(registers)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jstring)
}

func setHoldingRegister(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	registerFromRequest, err := flexitModbus.GetHoldingRegister(vars["name"])
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Body needs to be a JSON representation of a flexit register", 400)
		return
	}
	err = json.Unmarshal(body, &registerFromRequest)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	register, err := flexitModbus.GetHoldingRegister(vars["name"])
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	switch spesificRegister := registerFromRequest.(type) {
	case *flexitModbus.Int16Register:
		register.SetValue(spesificRegister.Value)
	case *flexitModbus.UInt16Register:
		register.SetValue(spesificRegister.Value)
	case *flexitModbus.UInt32Register:
		register.SetValue(spesificRegister.Value)
	case *flexitModbus.TemperatureRegister:
		register.SetValue(spesificRegister.Value)
	default:
		msg := fmt.Sprintf("Tried to write non-writable register: %T", spesificRegister)
		http.Error(w, msg, 400)
		return
	}

	if register.IsValueTooHigh() {
		msg := fmt.Sprintf(
			"value needs to be less or equal to the max value of %s (was %s)",
			register.GetMax(),
			register.GetValue(),
		)
		http.Error(w, msg, 400)
		return
	}

	if register.IsValueTooLow() {
		msg := fmt.Sprintf(
			"value needs to be more or equal to the min value of %s (was %s)",
			register.GetMin(),
			register.GetValue(),
		)
		http.Error(w, msg, 400)
		return
	}

	err = flexitModbus.WriteHoldingRegister(register)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	jstring, _ := json.Marshal(register)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jstring)
}

func fileHandler(path string) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, path)
	}
}
