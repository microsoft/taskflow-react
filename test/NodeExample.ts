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

export function asyncExceptionDouble() {
    return {
        run(num: number) : Promise<number> {
            return new Promise<number>((resolve, reject) => {
                throw "async exception"
            })
        }
    }
}

export function asyncTimeoutExceptionAdd() {
    let cachedResolve : (value: number | PromiseLike<number>) => void | undefined = undefined
    return {
        run(num1: number, num2: number) : Promise<number> {
            return new Promise<number>((resolve, reject) => {
                cachedResolve = resolve
                setTimeout(() => {
                    // it could not be catched in workflow executor
                    throw "timeout exception"
                }, 2000)
            })
        },
        cancel: () => {
            cachedResolve(undefined)
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

export function exceptionDouble() {
    return {
        run(num: number) {
            throw "sync exception"
        }
    }
}