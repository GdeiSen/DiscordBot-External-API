class Getter {
    async find(timeOut) {
        let num = timeOut;
        const promise = new Promise((resolve, reject) => {
            let timer = setTimeout(() => {
                resolve(num);
            }, timeOut);
        })
        return promise;
    }
}
let gettet = new Getter;
async function print(timeOut) {
    console.log(await gettet.find(timeOut))
}

async function get(timeOut) {
    let getter = new Getter();
    return await getter.find(timeOut);
}


async function test(timeOut) {
    let num = timeOut;
    const promise = new Promise((resolve, reject) => {
        let timer = setTimeout(() => {
            resolve(num);
        }, timeOut);
    })
    return promise;
}

print(2000);
print(1000);
print(3000);