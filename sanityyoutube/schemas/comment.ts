import {defineField, defineType} from 'sanity';

export default defineType(
    {
        name:'comment',
        type:'document',
        title:'Comment',
        fields: [
            defineField({
                name:"name",
                type:"string",
    
            }),
            defineField({
                title:"Approved",
                name:"approved",
                type:"boolean",
                description:"Comments wont show on the site without approval",
            }),
            defineField({
                name:"email",
                type:"string",
            }),
            defineField({
                name:"comment",
                type:"text",
            }),
            defineField({
                name:"post",
                type:"reference",
                to:[{type:"post"}],
            }),
        ],
    }
);

{/**here we are making a mutation to the santiy cms 
*defineField is used to define the fields that need to show up in the schema that is basically
the attributes and the type of values that can be stored in them
define type is used to define the type of data that is stored in them */}