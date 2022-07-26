let posts = [
    {title:"Post1", body: "This is post1", createdAt: new Date()},
{title:"Post2", body: "This is post2", createdAt: new Date()}
]

function createPost(post){

    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            posts.push(post)
            console.log(post.title+" created")

            const error = false

            if(!error){
                resolve(post)
            }else{
                reject("Error: Something went wrong")
            }
        },1000)
    })

    
}

function getPost(){
    setTimeout(()=>{
        let output = ""

        posts.forEach((post)=>{
            output+= `<li>${post.title}</li>`
        })
        document.body.innerHTML = output
    },1000)
}



function deletePost(){
    let p = new Promise((resolve, reject)=>{
        let error = false
        console.log("delete calles")

        if(posts.length===0){
            error = true
        }else{
            posts.pop()
        }
        
        if(!error){
            resolve()
        }else{
            reject("Error: Array is empty now")
        }
    })
    // deleting all posts until array is empty
    //p.then(deletePost).catch(err=>console.log(err))

    p.then(getPost).catch(err=>console.log(err))
    //console.log(p)

}

createPost({title:"Post3", body:"This is post3"})
.then(getPost).catch(err=>console.log(err))
.then(deletePost)
.then(getPost).catch(err=>console.log(err))
Promise.all

// const p1 = Promise.resolve("Hello World")
// const p2 = 10
// const p3 = new Promise((resolve, reject)=>{
//     setTimeout(resolve, 2000, "Goodbye")
// })
// const p4 = fetch("")
// Promise.all([p1,p2,p3]).then(values=>console.log(values))

function updateLastUserActivityTime(){
    return new Promise((resolve, reject)=>{
        setTimeout(resolve, 1000, new Date())
    })
}
const p4 = createPost({title:"Post3", body:"This is post3"})
const p5 = updateLastUserActivityTime()

Promise.all([p4,p5]).then(values=>console.log(values)).then(deletePost).then(getPost)

//createPost({title:"Post3", body:"This is post3"}).then(getPost).catch(err=>console.log(err))