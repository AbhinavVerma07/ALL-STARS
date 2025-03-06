import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const router = express.Router()

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataPath = path.join(__dirname, "..", "data", "contacts.json")

// Helper function to read contacts data
const getContacts = () => {
  const contactsData = fs.readFileSync(dataPath, "utf8")
  return JSON.parse(contactsData)
}

// Helper function to write contacts data
const saveContacts = (contacts) => {
  fs.writeFileSync(dataPath, JSON.stringify(contacts, null, 2))
}

// Submit contact form
router.post("/", (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({
        status: "error",
        message: "Name, email, and message are required",
      })
    }

    const contacts = getContacts()

    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      subject: subject || "No Subject",
      message,
      createdAt: new Date().toISOString(),
      read: false,
    }

    contacts.push(newContact)
    saveContacts(contacts)

    res.status(201).json({
      status: "success",
      message: "Contact form submitted successfully",
      data: newContact,
    })
  } catch (error) {
    console.error("Error submitting contact form:", error)
    res.status(500).json({
      status: "error",
      message: "Server error while submitting contact form",
    })
  }
})

// Get all contacts (admin only)
router.get("/", (req, res) => {
  try {
    // Check if user is admin
    if (!req.session.user || req.session.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to view contacts",
      })
    }

    const contacts = getContacts()

    res.status(200).json({
      status: "success",
      results: contacts.length,
      data: contacts,
    })
  } catch (error) {
    console.error("Error fetching contacts:", error)
    res.status(500).json({
      status: "error",
      message: "Server error while fetching contacts",
    })
  }
})

// Mark contact as read
router.patch("/:id/read", (req, res) => {
  try {
    // Check if user is admin
    if (!req.session.user || req.session.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update contacts",
      })
    }

    const contacts = getContacts()
    const contactIndex = contacts.findIndex((c) => c.id === req.params.id)

    if (contactIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Contact not found",
      })
    }

    // Mark as read
    contacts[contactIndex].read = true
    saveContacts(contacts)

    res.status(200).json({
      status: "success",
      message: "Contact marked as read",
      data: contacts[contactIndex],
    })
  } catch (error) {
    console.error("Error updating contact:", error)
    res.status(500).json({
      status: "error",
      message: "Server error while updating contact",
    })
  }
})

export default router

