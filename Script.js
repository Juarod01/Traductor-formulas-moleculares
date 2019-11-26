var search = document.getElementById('search')
var error = document.getElementById('error')
var dataFormula = document.getElementById('formula')
var description = document.getElementById('description')
var ul = document.getElementById('ul')
var container = document.getElementById('container')
var formulaDescription = document.getElementById('formulaDescription')

button.addEventListener("click", split)
clean.addEventListener("click", cleaner)
back.addEventListener("click", backPpal)

function cleaner(){
    search.value = ""
    error.classList.add("hidden")
    error.innerHTML = ""
}
function backPpal(){
    container.classList.remove("hidden")
    formulaDescription.classList.add("hidden")
    search.value = ""
    dataFormula.innerHTML = ""
    ul.innerHTML = ""
    description.innerHTML = ""
}

function split(){
    var formula = search.value
    importAllowedValues(formula)
    showFormula(formula)
}

function importAllowedValues(symbol){
    const xhttp = new XMLHttpRequest()
    xhttp.open('GET', 'Permitidos.json', true)
    xhttp.send()
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let DataAllowed = JSON.parse(this.responseText)
            passToLetters = symbol.split('')
            var check = []
            for(var i=0; i<passToLetters.length; i++){
                const value = DataAllowed.some(item => item.valor === passToLetters[i])
                check[i] = value
            }
            const value2 = check.every(item => item === true)
            if(value2){
                isLetterOrNumber(passToLetters)
                description.innerHTML = description.innerHTML + "En una molécula de " + symbol + " hay: "
            }else{
                error.classList.remove("hidden")
                error.innerHTML = error.innerHTML + "Verificar formula, existen caracteres incorrectos."
            }
        }
    }
}

function isLetterOrNumber(letter){
    let elements = []
    //debugger
    if(checkType(letter[0])){ //start with upppercase
        elements[0] = letter[0]
        for(var i=1; i<letter.length; i++){
            if(isNaN(letter[i])){//letter
                if(checkType(letter[i])){ //Uppercase
                    elements[i] = letter[i] 
                }
                else{ //Lowercase
                    if(checkType(elements[i-1])==false || isLetterOrNumber(elements[i-1])==false){ 
                        //console.log("La formula esta mal escrita")
                        error.classList.remove("hidden")
                        error.innerHTML = error.innerHTML + "Verificar fórmula, está mal escrita."
                        return
                    }else{
                        elements[i-1] = elements[i-1] + letter[i]
                    }
                }
            }else{
                //Number
                elements[i] = letter[i]
            }
        }
        container.classList.add("hidden")
        formulaDescription.classList.remove("hidden")
        importData(elements)
    }else{
        //console.log("Debe empezar con letra mayuscula")
        error.classList.remove("hidden")
        error.innerHTML = error.innerHTML + "Verificar fórmula, está mal escrita."
    }   
}

function checkType(Letter) {
    words = String(Letter).trim()
    const regxs = {
      "lower": /^[a-z]+$/,
      "upper": /^[A-Z]+$/,
    }
    if (regxs.upper.test(words)) return true
    if (regxs.lower.test(words)) return false
}

function importData(symbol){
    const xhttp = new XMLHttpRequest()
    xhttp.open('GET', 'elementos.json', true)
    xhttp.send()
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let Data = JSON.parse(this.responseText)
            for(let i of Data){
                for(var j=0; j<symbol.length; j++){
                    if(i.Símbolo == symbol[j]){
                        //console.log(i.Nombre)
                        ul.innerHTML = ul.innerHTML + "<li>" + i.Nombre + "</li>"
                    } 
                }
            }
        }
    }
}

function showFormula(symbol){
    const xhttp = new XMLHttpRequest()
    xhttp.open('GET', 'formulas.json', true)
    xhttp.send()
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let Data = JSON.parse(this.responseText)
            const value = Data.some(item => item.formula === symbol)
            //console.log(value)
            if(value){
                for(let i of Data){
                    if(i.formula == symbol){
                        dataFormula.innerHTML = dataFormula.innerHTML + symbol + " es " + i.nombre
                    }
                }
            } else{
                dataFormula.innerHTML = "La fórmula ingresada no se encuentra en la base de datos."
            }
        }
    }
}
//**********************************************************************************************************

function regularExpressions(formula){
    const Regex = /(^[A-Z]{1}[a-z]?[0-9]?[A-Z]?)/
    if(Regex.test(formula)){
        console.log('Formula válida')
    }         
    else{
        console.log('Formula incorrecta')
    } 
}