import { GetStaticProps } from 'next'
import React, { useState } from 'react'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import sanityCli from '../../sanityyoutube/sanity.cli'
import { Post } from '../../typings'
import PortableText from "react-portable-text";
import {useForm, SubmitHandler} from "react-hook-form"
import comment from '../../sanityyoutube/schemas/comment'

interface Props{
    post:Post;
}

interface IFormInput{
    _id:string;
    name:string;
    email:string;
    comment:string;
}

const Post = ({post}:Props) => {
    const [submit,setSubmit] = useState(false);
    console.log(post);
    const {register,handleSubmit,formState:{errors}} =useForm<IFormInput>();
    const onSubmit:SubmitHandler<IFormInput> = async(data)=>{
        /**what is SubmitHanlder?
         * are we typecasting onSubmit as a function that inherits the SubmitHandler function that deals with data of the IFormInput?
         */
        await fetch('/api/createComment',{
            method:"POST",
            body:JSON.stringify(data),

        }).then(()=>{
            console.log(data);
            setSubmit(true);
        }).catch((err)=>{
            console.log(err);
            setSubmit(false);
        })
    }
  return (
    <main> 
        <Header/>
        {/* banner for the article page */}
        <img className='w-full h-40 object-cover' src ={urlFor(post.mainImage).url()} alt=''/>

        <article className='max-w-3xl mx-auto p-5'>
            <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
            <h2 className='text-xl font-light text-gray-500 mb-2'>{post.description}</h2>
            <div className='flex items-center space-x-2'>
                <img className='h-10 w-10 rounded-full' src={urlFor(post.author.image).url()!} alt="" />
                <p className="font-extralight text-sm">Blog post by <span className='text-green-600'>{post.author.name}</span>-Published at {new Date(post._createdAt).toLocaleString()}</p>
            </div>
            <div className='mt-10'>
                {/** here Portable Text is a modeule from react portable text that passes in the
                 * body of the article
                 * serializers are used to describe what is done with the h1 h2 and how we
                 * want them rendered in the webpage
                 */}
                <PortableText
                dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                content={post.body}
                serializers={
                    {
                        h1:(props:any)=>(
                            <h1 className='text-2xl font-bold my-5' {...props} />
                        ),
                        h2:(props:any)=>(
                            <h2 className='text-xl font-bold my-5' {...props} />
                        ),
                        li:({children}:any)=>(
                            <li className='ml-4 list-disc'>{children}</li>
                        ),
                        link:({href,children}:any)=>(
                            <a href={href} className="text-blue-500 hover:underline">
                                {children}
                            </a>
                        ),
                    }
                }
                />
            </div>
        </article>
        <hr className='max-w-lg my-5 mx-auto border border-yellow-500' />
        {/**Checking if submit equals true
         * if submit equals true then you dont have to submit another comment and you are done
         * else you may have another attempt at submitting your comment!
         */}
        {submit?(
            <div className='flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto '>
                <h3 className='text-3xl font-bold'>Submited your Comments!</h3>
                <p>Once it has been approved it will appear below</p>
            </div>
        ):(
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-5 max-w-2xl mx-auto mb-10'>

                <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
                <h4 className="text-3xl font-bold">Leave a Comment Below</h4>
                <hr className="py-3 mt-2" />

                <input {
                    ...register("_id")//what does this register do? this is a function that connect react-hook-form to the form that we have
                }
                type="hidden"
                name="_id"
                value={post._id} />

            <label className='block mb-5'>
                <span className='text-gray-700'>Name</span>

                <input
                {...register("name",{required:true})}//here i am registering the name row to the form that we are handing out to the back end
                className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 focus:ring outline-none' placeholder='John Appleseed' type="text" />
            
            </label>

            <label className='block mb-5'>
                <span className='text-gray-700'>Email</span>

                <input
                {...register("email",{required:true})}  className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 focus:ring  outline-none' placeholder='John Appleseed' type="email" />
                
            </label>

            <label className='block mb-5'>
                <span className='text-gray-700'>Comment</span>

                <textarea
                {...register("comment",{required:true})}
                className='shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 focus:ring outline-none' placeholder='John Appleseed' rows={8}  />
                
            </label>
            {/**errors will return when validation fails */}
            <div className='flex flex-col p-5'>
                {errors.name && (<p className='text-red-500'>The name field is required!</p>)}
                {errors.email && (<p className='text-red-500'>The email field is required!</p>)}
                {errors.comment && (<p className='text-red-500'>The Comment field is required!</p>)}
            </div>
            <input type="submit" className='shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer'/>
        </form>
        )}

        {/**writing comments down in the page */}
        <div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2'>
            <h3 className='text-4xl'>Comments</h3>
            <hr className='pb-2'/>
            {post.comments.map((comment)=>(
                <div key={comment._id}>
                    <p><span className='text-yellow-500'>{comment.name} says</span>: {comment.comment}</p>
                </div>
                
            ))}
        </div>
    </main>
  )
}

export default Post

export const getStaticPaths= async()=>{
    const query =`*[_type=="post"]{
        _id,
        slug{
            current
        }
    }`;
    const posts =await sanityClient.fetch(query);
    const paths = posts.map((post:Post)=>({
        params:{
            slug:post.slug.current
        }
    }))
    return{
        paths,
        fallback:'blocking'
    }
}

export const getStaticProps: GetStaticProps = async({params})=>{
    /**here the value passed as the parameter is called the context */
    const query =`*[_type=='post'&& slug.current==$slug][0]{
        _id,
        _createdAt,
        title,
        author ->{
            name,
            image
        },
        'comments': *[
            _type =='comment'&&
            post._ref == ^._id &&
            approved == true],
        description,
        mainImage,
        slug,
        body
    }`;

    const post =await sanityClient.fetch(query,{
        slug:params?.slug,
        /**if you are sure that something has to be there you use
         * ! exclamation mark at the end
         * if you are not sure that its going to be there and want next to
         * handle it if its not there then you use ?
         */
    })

    if(!post){
        return{
            notFound:true
        }
    }

    return{
        props:{
            post,

        },
        revalidate:60,// this will force the browser to reload the old cache version and check if new versions are availabe

    }
}