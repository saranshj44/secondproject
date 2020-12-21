const mongoose=require('mongoose');
const plm =require('passport-local-mongoose');
mongoose.connect('mongodb://localhost/projecttwo', {useNewUrlParser: true, useUnifiedTopology: true});

var userSchema=mongoose.Schema({
  name:String,
  username:String,
  password:String,
  email:String,
  profileimg:{
    type:String,
    default:'../images/upload/default.jpg'
  }
})
userSchema.plugin(plm);
module.exports=mongoose.model('user',userSchema);

