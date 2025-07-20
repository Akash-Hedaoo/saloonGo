const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const { authenticateToken: auth } = require('../middleware/auth');

// Book Appointment
router.post('/book', auth, async (req, res) => {
  try {
    const {
      salonId,
      serviceId,
      serviceName,
      date,
      time,
      customerId,
      customerName,
      totalAmount
    } = req.body;

    // Validate required fields
    if (!salonId || !serviceId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if salon exists and is available
    const salonDoc = await db.collection('salons').doc(salonId).get();
    if (!salonDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    const salonData = salonDoc.data();
    if (!salonData.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Salon is currently not accepting appointments'
      });
    }

    // Check if the requested date is a holiday
    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const dayHours = salonData.workingHours?.[dayOfWeek];
    
    if (!dayHours || !dayHours.isOpen) {
      return res.status(400).json({
        success: false,
        message: 'Salon is closed on the selected date'
      });
    }

    // Check if time is within working hours
    if (time < dayHours.open || time > dayHours.close) {
      return res.status(400).json({
        success: false,
        message: 'Selected time is outside working hours'
      });
    }

    // Check for holidays
    const holidays = salonData.holidays || [];
    const isHoliday = holidays.some(holiday => {
      const holidayDate = new Date(holiday.date);
      const requestDate = new Date(date);
      return holidayDate.toDateString() === requestDate.toDateString();
    });

    if (isHoliday) {
      return res.status(400).json({
        success: false,
        message: 'Salon is closed on the selected date (holiday)'
      });
    }

    // Check for existing appointments at the same time
    const existingAppointments = await db.collection('appointments')
      .where('salonId', '==', salonId)
      .where('date', '==', date)
      .where('time', '==', time)
      .where('status', 'in', ['pending', 'confirmed'])
      .get();

    if (!existingAppointments.empty) {
      return res.status(400).json({
        success: false,
        message: 'Time slot is already booked'
      });
    }

    const appointmentData = {
      salonId,
      serviceId,
      serviceName,
      date,
      time,
      customerId: customerId || req.user.uid,
      customerName: customerName || req.user.displayName || req.user.email,
      salonName: salonData.name,
      totalAmount,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const appointmentRef = await db.collection('appointments').add(appointmentData);
    
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointmentId: appointmentRef.id,
      appointment: { id: appointmentRef.id, ...appointmentData }
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
      error: error.message
    });
  }
});

// Get Customer Appointments
router.get('/my-appointments', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = db.collection('appointments')
      .where('customerId', '==', req.user.uid)
      .orderBy('createdAt', 'desc');

    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    const appointments = [];
    
    snapshot.forEach(doc => {
      appointments.push({ id: doc.id, ...doc.data() });
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedAppointments = appointments.slice(startIndex, endIndex);

    res.json({
      success: true,
      appointments: paginatedAppointments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(appointments.length / limit),
        totalAppointments: appointments.length,
        hasNext: endIndex < appointments.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get my appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments',
      error: error.message
    });
  }
});

// Get Salon Appointments (for salon owners)
router.get('/salon-appointments/:salonId', auth, async (req, res) => {
  try {
    const { salonId } = req.params;
    const { status, date, page = 1, limit = 10 } = req.query;

    // Check if user owns this salon
    const salonDoc = await db.collection('salons').doc(salonId).get();
    if (!salonDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    if (salonDoc.data().ownerId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view appointments for this salon'
      });
    }

    let query = db.collection('appointments')
      .where('salonId', '==', salonId)
      .orderBy('createdAt', 'desc');

    if (status) {
      query = query.where('status', '==', status);
    }

    if (date) {
      query = query.where('date', '==', date);
    }

    const snapshot = await query.get();
    const appointments = [];
    
    snapshot.forEach(doc => {
      appointments.push({ id: doc.id, ...doc.data() });
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedAppointments = appointments.slice(startIndex, endIndex);

    res.json({
      success: true,
      appointments: paginatedAppointments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(appointments.length / limit),
        totalAppointments: appointments.length,
        hasNext: endIndex < appointments.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get salon appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get salon appointments',
      error: error.message
    });
  }
});

// Update Appointment Status (for salon owners)
router.put('/:appointmentId/status', auth, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    const appointmentDoc = await db.collection('appointments').doc(appointmentId).get();
    if (!appointmentDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const appointmentData = appointmentDoc.data();

    // Check if user owns the salon
    const salonDoc = await db.collection('salons').doc(appointmentData.salonId).get();
    if (!salonDoc.exists || salonDoc.data().ownerId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this appointment'
      });
    }

    const updateData = {
      status,
      updatedAt: new Date()
    };

    if (notes) {
      updateData.notes = notes;
    }

    await db.collection('appointments').doc(appointmentId).update(updateData);

    res.json({
      success: true,
      message: 'Appointment status updated successfully'
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment status',
      error: error.message
    });
  }
});

// Cancel Appointment (for customers)
router.put('/:appointmentId/cancel', auth, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;

    const appointmentDoc = await db.collection('appointments').doc(appointmentId).get();
    if (!appointmentDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const appointmentData = appointmentDoc.data();

    // Check if user owns the appointment
    if (appointmentData.customerId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to cancel this appointment'
      });
    }

    // Check if appointment can be cancelled (not completed or already cancelled)
    if (['completed', 'cancelled'].includes(appointmentData.status)) {
      return res.status(400).json({
        success: false,
        message: 'Appointment cannot be cancelled'
      });
    }

    const updateData = {
      status: 'cancelled',
      cancellationReason: reason,
      cancelledAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('appointments').doc(appointmentId).update(updateData);

    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
});

// Get Appointment Details
router.get('/:appointmentId', auth, async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointmentDoc = await db.collection('appointments').doc(appointmentId).get();
    if (!appointmentDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const appointmentData = appointmentDoc.data();

    // Check if user has access to this appointment
    const isCustomer = appointmentData.customerId === req.user.uid;
    const isSalonOwner = await checkSalonOwnership(appointmentData.salonId, req.user.uid);

    if (!isCustomer && !isSalonOwner) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this appointment'
      });
    }

    res.json({
      success: true,
      appointment: { id: appointmentDoc.id, ...appointmentData }
    });
  } catch (error) {
    console.error('Get appointment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointment details',
      error: error.message
    });
  }
});

// Helper function to check salon ownership
async function checkSalonOwnership(salonId, userId) {
  try {
    const salonDoc = await db.collection('salons').doc(salonId).get();
    return salonDoc.exists && salonDoc.data().ownerId === userId;
  } catch (error) {
    return false;
  }
}

// Get Available Time Slots for a Salon
router.get('/available-slots/:salonId', async (req, res) => {
  try {
    const { salonId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const salonDoc = await db.collection('salons').doc(salonId).get();
    if (!salonDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    const salonData = salonDoc.data();
    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const dayHours = salonData.workingHours?.[dayOfWeek];

    if (!dayHours || !dayHours.isOpen) {
      return res.json({
        success: true,
        availableSlots: [],
        message: 'Salon is closed on this date'
      });
    }

    // Check for holidays
    const holidays = salonData.holidays || [];
    const isHoliday = holidays.some(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.toDateString() === requestedDate.toDateString();
    });

    if (isHoliday) {
      return res.json({
        success: true,
        availableSlots: [],
        message: 'Salon is closed on this date (holiday)'
      });
    }

    // Get existing appointments for the date
    const existingAppointments = await db.collection('appointments')
      .where('salonId', '==', salonId)
      .where('date', '==', date)
      .where('status', 'in', ['pending', 'confirmed'])
      .get();

    const bookedTimes = [];
    existingAppointments.forEach(doc => {
      bookedTimes.push(doc.data().time);
    });

    // Generate available time slots
    const slots = [];
    const startTime = new Date(`2000-01-01 ${dayHours.open}`);
    const endTime = new Date(`2000-01-01 ${dayHours.close}`);
    const slotDuration = 30; // 30 minutes per slot

    let currentTime = new Date(startTime);
    while (currentTime < endTime) {
      const timeSlot = currentTime.toTimeString().slice(0, 5);
      if (!bookedTimes.includes(timeSlot)) {
        slots.push(timeSlot);
      }
      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
    }

    res.json({
      success: true,
      availableSlots: slots,
      workingHours: {
        open: dayHours.open,
        close: dayHours.close
      }
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available slots',
      error: error.message
    });
  }
});

module.exports = router; 