const {File,Category,Post} = require("../model");

const addPost = async(req,res,next)=>{
    try {
        const{title,desc,file,category} = req.body;
        const {_id} = req.user;
        if(file){
            const isFileExist = await File.findById(file);
            if(!isFileExist){
                res.code = 404;
                throw new Error("file not found");
            }
        }
        const isCategoryExist = await Category.findById(category);
        if(!isCategoryExist){
            res.code = 404;
            throw new Error("category not found");
        }

        const newPost = new Post({
            title,desc,file,category,updatedBy:_id
        });

        await newPost.save();

        res.status(200).json({code:200,status:true,message:"post added successfully"});

    } catch (error) {
        next(error);
    }
}

const updatePost = async (req, res, next) => {
    try {
        const { title, desc, file, category } = req.body;
        const { id } = req.params;
        const { _id } = req.user;

        // Validate file if provided
        if (file) {
            const isFileExist = await File.findById(file);
            if (!isFileExist) {
                return res.status(404).json({ code: 404, status: false, message: "File not found" });
            }
        }

        // Validate category if provided
        if (category) {
            const isCategoryExist = await Category.findById(category);
            if (!isCategoryExist) {
                return res.status(404).json({ code: 404, status: false, message: "Category not found" });
            }
        }

        // Find the post by ID
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ code: 404, status: false, message: "Post not found" });
        }

        // Update fields only if provided
        if (title) post.title = title;
        if (desc) post.desc = desc;
        if (file) post.file = file;
        if (category) post.category = category;

        post.updatedBy = _id;

        // Save the updated post
        await post.save();

        // Populate category field before returning the response
        const updatedPost = await Post.findById(post._id).populate("category file");

        return res.status(200).json({
            code: 200,
            status: true,
            message: "Post updated successfully",
            data: { post: updatedPost },
        });
    } catch (error) {
        next(error);
    }
};

deletePost = async(req,res,code)=>{
    try {
        const {id} = req.params;

        const post = await Post.findById(id);
        if(!post){
            res.code = 404;
            throw new Error("post not found");
        }
        await Post.findByIdAndDelete(id);

        res.status(200).json({code:200,status:true,message:"post deleted successfully"});
    } catch (error) {
        next(error);
    }
}

const getPostList = async(req,res,next)=>{
    try {
        const {page ,size ,q ,category} = req.query;
        const pageNumber = parseInt(page) || 1;
        const sizeNumber = parseInt(size) || 10;
        let query = {}

        if(q){
            const search = new RegExp(q,"i");
            console.log(q)
            query = {
                $or : [{title : search}]
            }
        }
        if(category){
            query = {...query, category};
            console.log(query);
        }

        const total = await Post.countDocuments();
        const pages = Math.ceil(total/pageNumber);

        const posts = await Post.find(query).sort({updatedBy: -1}).skip((pageNumber -1)*sizeNumber).limit(sizeNumber);

        res.status(200).json({code:200,status:true,message:"get post list Successfully",data:{posts,total,pages}})

    } catch (error) {
        next(error);
    }
}

const getPost = async(req,res,next)=>{
    try {
        const {id} = req.params;
        const posts = await Post.findById(id).populate("file").populate("category").populate("updatedBy", "-password");
        if(!posts){
            res.code = 404;
            throw new Error("posts not found");
        }

        res.status(200).json({code:200,status:true,message:"get post successfully",data:{posts}});
    } catch (error) {
        next(error);
    }
}

module.exports = {addPost,updatePost,deletePost,getPostList,getPost};