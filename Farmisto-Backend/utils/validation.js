const validateProfileData=(req)=>{
    const editableFields=["farmerName","farmerEmail","farmerAddress","farmerCity","farmerCityZip","farmerCountry"];
    const isAllowed=Object.keys(req.body).every(field=>editableFields.includes(field));
    // console.log("is allowed"+isAllowed);
    return isAllowed;
}

module.exports=validateProfileData;
