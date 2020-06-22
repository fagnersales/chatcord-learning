const Functions = (num) => ({
    addOne: () => {
        return num + 1
    },

    addTwo: () => {
        return num + 2
    },

    addNumber: (number) => {
        return num + number
    }
})

const { addNumber, addTwo, addOne} = Functions(5)

console.log(addOne())
console.log(addTwo())
console.log(addNumber(5))