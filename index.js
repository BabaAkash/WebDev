let posts = [
    {title:"Post1", body: "This is post1", createdAt: new Date()},
    {title:"Post2", body: "This is post2", createdAt: new Date()}
]

const postOperation = async () => {

   
    const createPost = function(post){
        console.log("create")
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                posts.push(post)
                let error = false
                if(!error) resolve(post)
                else reject("Error: Something went wrong")
            },1000)
            console.log(posts)
            resolve("Post Created")
        })
    }

    const deletePost = function(){
            return new Promise((resolve, reject)=>{
            console.log("delete")
            let error = false

            if(posts.length === 0) error = true
            else posts.pop()

            if(!error) resolve("Post deleted")
            else reject("Error: Array is empty now")

        })
    }
    const getPost = function(){
            return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                console.log("get")
            
                let output = ""
    
                posts.forEach((post)=>{
                    output +=`<li> ${post.title} </li>`
                })
                document.body.innerHTML = output
                
                resolve("Posts printed")
            },1000)
            
        })
    }

    const updateLastUserActivityTime = function(){
        return new Promise((resolve, reject)=>{
            console.log("update")
            setTimeout(resolve, 1000, new Date())
        })
    }

    let create = await createPost({title:"Post3", body:"this is post3",createdAt: new Date()})
    console.log(create)
    let update = await updateLastUserActivityTime()
    console.log(update)
    let get = await getPost()
    console.log(get)
    let del = await deletePost()
    console.log(del)
    let get1 = await getPost()
    console.log(get1)

    return "Operations Done"
}

postOperation().then(m=>console.log(m))