import express from "express"
import Contact from "../models/Contact.js"

const router = express.Router()

// Get all contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json(contacts)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    res.status(500).json({ error: "Error fetching contacts" })
  }
})

// Submit contact form
router.post("/", async (req, res) => {
  try {
    const contact = new Contact(req.body)
    await contact.save()
    
    res.render("contact", {
      success: "Thank you for your message. We'll get back to you soon!"
    })
  } catch (error) {
    console.error("Error submitting contact form:", error)
    res.render("contact", {
      error: "There was an error submitting your message. Please try again."
    })
  }
})

// Update contact status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" })
    }
    
    res.json(contact)
  } catch (error) {
    console.error("Error updating contact status:", error)
    res.status(500).json({ error: "Error updating contact status" })
  }
})

// Delete contact
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" })
    }
    
    res.json({ message: "Contact deleted successfully" })
  } catch (error) {
    console.error("Error deleting contact:", error)
    res.status(500).json({ error: "Error deleting contact" })
  }
})

export default router

