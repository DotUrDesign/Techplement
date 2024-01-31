const userModel = require('../Models/userModel');

module.exports.userProfile = async function userProfile(req, res){
    try {
        let userId = req.id;
        let userDetails = await userModel.findById(userId);
        if(!userDetails){
            return res.status(200).send("Unable to fetch the details of the user");
        }

        return res.status(200).json({
            message : "User data fetched!",
            userDetails : userDetails
        })

    } catch (error) {
        console.log(error.message);
    }
}

module.exports.updateProfile = async function updateProfile(req, res){
    try {
        let userId = req.id;
        let dataToBeUpdated = req.body;
        let userDetails = await userModel.findById(userId);
        if(!userDetails){
            return res.status(200).send("Unable to fetch the details of the user");
        }

        let keys = [];
            // the array now consists of fields that are to be updated.
            for(let key in dataToBeUpdated)
                keys.push(key);

            console.log(keys);

            for(let i=0;i<keys.length;i++)
                userDetails[keys[i]] = dataToBeUpdated[keys[i]];

        await userDetails.save();

        return res.status(200).json({
            message : "User data updated successfully",
            updatedUserDetails : userDetails
        })

    } catch (error) {
        console.log(error.message);
    }
}

module.exports.deleteProfile = async function deleteProfile(req, res){
    try {
        let userId = req.id;
        await userModel.findByIdAndDelete(userId);

        return res.status(200).send("User profile deleted successfully!");
    } catch (error) {
        console.log(error);
    }
}