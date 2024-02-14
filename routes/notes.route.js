const express = require('express');
const router = express.Router();
const Note = require('../models/notes.model');
const authMiddleware = require('../middlewares/auth');

router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { title, body } = req.body;
        const decodedAuthor = req.user.username; 

        const note = new Note({
            title,
            body,
            author: decodedAuthor,
        });

        await note.save();

        res.status(201).json({ message: 'Created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}); 

router.get('/view', authMiddleware, async (req, res) => {
    try {
        const author = req.user.username;

        const notes = await Note.find({ author });

        res.status(200).json({ notes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
});

router.patch('/update/:id' ,authMiddleware, async(req, res) => {
    const NoteId = req.params.id
    try {
        
        const noteToUpdate = await Note.findById(NoteId)
        if(noteToUpdate.username === req.user.username){
            const updatedNote = await Note.findByIdAndUpdate(NoteId, req.body)
            return res.status(201).json({mssge: " updated successfully"})

        }
        else{
            return res.status(401).json({mssg: "not authorised"})
        }
    } catch (error) {
        res.status(500).json(error);
    }
} )

router.delete('/delete/:id' ,authMiddleware, async(req, res) => {
    const NoteId = req.params.id
    try {
        
        const noteToUpdate = await Note.findById(NoteId)
        if(noteToUpdate.username === req.user.username){
            const updatedNote = await Note.findByIdAndDelete(NoteId)
            return res.status(201).json({mssge: " deleted successfully"})

        }
        else{
            return res.status(401).json({mssg: "not authorised"})
        }
    } catch (error) {
        res.status(500).json(error);
    }
} )


module.exports = router;
