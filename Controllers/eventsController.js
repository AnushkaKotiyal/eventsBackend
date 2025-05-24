const Event  = require('../Models/Events');

// Create a new event
const createEvent = async (req, res) => {
  try {
    const { event_name, event_type, location, date_time, price, created_by } =
      req.body;
      if(!event_name|| !event_type|| !location|| !date_time|| !price|| !created_by){
        return res.status(400).json({
          success:false,
          message:"Fill all the Mandatory Fields",
          error
        })
      }
    const newEvent = await Event.create({
      event_name,
      event_type,
      location,
      date_time,
      price,
      created_by,
    });
    res.status(201).json({ 
      success:true,
      event: newEvent ,
      message:"Event creation successfull"
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event" });
  }
};

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
};

// Get an event by ID
const getEventById = async (req, res) => {
  try {
    if(!req.params.id){
      return res.status(400).json({
        success:false,
        message:"Event id required",
        error
      })
    }
    const event = await Event.findByPk(req.params.id);
    if (event) {
      res.status(200).json({ 
        event 
      });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    res.status(500).json({ message: "Error fetching event" });
  }
};

// Update an event by ID
const updateEvent = async (req, res) => {
  try {
    const { event_name, event_type, location, date_time, price, created_by } =
    req.body;
    if(!event_name|| !event_type|| !location|| !date_time|| !price|| !created_by){
      return res.status(400).json({
        success:false,
        message:"Fill all the Mandatory Fields",
        error
      })
    }
    const [updated] = await Event.update(
      { event_name, event_type, location, date_time, price, created_by },
      { where: { event_id: req.params.id } }
    );
    if (updated) {
      const updatedEvent = await Event.findByPk(req.params.id);
      res.status(200).json({success:true, event: updatedEvent, message:"Event Updated Successfully" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Error updating event" });
  }
};

// Delete an event by ID
const deleteEvent = async (req, res) => {
  try {
    // const deleted = await Event.destroy({ where: { event_id: req.params.id } });
    const updated=await  Event.update({event_status:'inactive'},{where:{event_id:req.params.id} })
    if (updated) {
      const event=await Event.findByPk(req.params.id);
      res.status(204).json({ 
        message: "Event deleted",
        event
       });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Error deleting event" });
  }
}; 

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
