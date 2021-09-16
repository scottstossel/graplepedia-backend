const { json } = require('express');
const express = require('express');
const Technique = require('../models/Technique');
const router = express.Router();

//GET ALL
router.get('/', async (req, res) => {
  const techniques = await Technique.find();
  try {
    return res.status(200).json(techniques);
  } catch (error) {
    return res.status(500).json({message: "Could not get the techniques"});
  }
});

//get technique
router.get('/technique/:id', async (req, res) => {
  const {id} = req.params;
  const singleTechnique = await Technique.findById(id);
  try {
    return res.status(200).json(singleTechnique);
  } catch (error) {
    return res.status(500).json({message: "Could not get the technique"});
  }
});

//POST technique
router.post('/technique', async (req, res) => {
  const techniqueToCreate = await Technique.create(req.body);
  try {
    return res.status(201).json(techniqueToCreate);
  } catch (error) {
    return res.status(500).json({message: "Could not create technique"});
  }
});

//POST image
router.post('/technique/imageUpload/:id', async (req, res) => {
  const {id} = req.params;
  const techniqueToUpdate = await Technique.findById(id);

  if (techniqueToUpdate.img) {
    let array = techniqueToUpdate.img.split('/');
    let fileName = array[array.length-1];
    const [public_id] = fileName.split('.');
    await cloudinary.uploader.destroy(public_id);
  }

  const {tempFilePath} = req.files.image;

  const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
  techniqueToUpdate.img = secure_url;
  await techniqueToUpdate.save();
  try {
    return res.status(201).json(techniqueToUpdate);
  } catch (error) {
    return res.status(500).json({message: "There was and error uploading the image"})
  }
})


//PUT technique
router.put('/technique/:id', async (req, res) => {
  const {id} = req.params;
  const techniqueToUpdate = await Technique.findByIdAndUpdate(id, req.body, {new: true});
  try {
    return res.status(202).json(techniqueToUpdate);
  } catch (error) {
    return res.status(500).json({message: "Couldn't update technique, check server"});
  }
});

//DELETE technique
router.delete('/technique/:id', async (req, res) => {
  const {id} = req.params;
  const techniqueToDelete = await Technique.findByIdAndDelete(id);
  try {
    return res.json({message: "Technique successfully deleted"});
  } catch (error) {
    return res.status(500).json({message: "ERROR could not delete technique"});
  }
})

module.exports = router;