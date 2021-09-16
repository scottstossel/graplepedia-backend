const express = require('express');
const Position = require('../models/Position');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

//GET ALL
router.get('/', async (req, res) => {
  const positions = await Position.find();
  try {
    return res.status(200).json(positions)
  }
  catch (error) {
    return res.status(500).json({message: "Could not get the positions"})
  }
})

//GET Single
router.get('/position/:id', async (req, res) => {
  const { id } = req.params;
  const singlePosition = await Position.findById(id);
  try {
    return res.status(200).json(singlePosition);
  } catch (error) {
    return res.status(500).json({message: "Couldn't find position"});
  }
})

//POST position
router.post('/position', async (req, res) => {
  const positionToCreate = await Position.create(req.body);
  try {
    return res.status(201).json(positionToCreate);
  } catch (error) {
    return res.status(500).json({message: "Couldn't create the position"});
  }
})

//POST image upload
router.post('/position/imageUpload/:id', async (req, res) => {
  const { id } = req.params;
  const positionToUpdate = await Position.findById(id);
  
  if (positionToUpdate.img) {
    let array = positionToUpdate.img.split('/');
    positionToUpdate.img = "";
    let fileName = array[array.length-1];
    const [public_id] = fileName.split('.');
    try {
      await cloudinary.uploader.destroy(public_id);
    } catch (error) {
      console.log('no cloudinary image')
    }
  }

  const { tempFilePath } = req.files.image;

  const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
  positionToUpdate.img = secure_url;
  await positionToUpdate.save();
  try {
    return res.status(201).json(positionToUpdate);
  } catch (error) {
    return res.status(500).json({message: "There was an error uploading the image"});
  }

})

//PUT position
router.put('/position/:id', async (req, res) => {
  const {id} = req.params;
  const positionToUpdate = await Position.findByIdAndUpdate(id, req.body, {new: true});
  try {
    return res.status(202).json(positionToUpdate);
  } catch (error) {
    return res.status(500).json("Error, couldn't update the position");
  }
})

//DELETE position
router.delete('/position/:id', async (req, res) => {
  const {id} = req.params;
  await Position.findByIdAndDelete(id);
  try {
    return res.json({message: 'Position has been deleted'});
  } catch (error) {
    return res.status(500).json({message: 'Position was not deleted, check server'});
  }
})

module.exports = router;