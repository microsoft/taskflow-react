export function asyncAdd() {
    return {
        run(num1: number, num2: number) : Promise<number> {
            return new Promise<number>((resolve, reject) => {
                setTimeout(() => {
                    resolve(num1 + num2)
                }, 2000)
            })
        }
    }
}

export function asyncDouble() {
    return {
        run(num: number) : Promise<number> {
            return new Promise<number>((resolve, reject) => {
                setTimeout(() => {
                    resolve(num * 2)
                }, 2000)
            })
        }
    }
}

export function add() {
    return {
        run(num1: number, num2: number) {
            return num1 + num2;
        }
    }
}

export function double() {
    return {
        run(num: number) {
            return num * 2;
        }
    }
}