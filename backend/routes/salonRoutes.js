const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const { authenticateToken, isSalonOwner } = require('../middleware/auth');
const admin = require('firebase-admin');

// Task 2.1: Salon CRUD Operations

// Create/Register Salon
router.post('/register', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      services,
      workingHours,
      images
    } = req.body;

    const salonData = {
      ownerId: req.user.userId,
      name,
      description,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      services: services || [],
      workingHours: workingHours || {},
      images: images || [],
      isActive: true,
      rating: 0,
      totalReviews: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const salonRef = await db.collection('salons').add(salonData);
    
    res.status(201).json({
      success: true,
      message: 'Salon registered successfully',
      salonId: salonRef.id,
      salon: { id: salonRef.id, ...salonData }
    });
  } catch (error) {
    console.error('Salon registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register salon',
      error: error.message
    });
  }
});

// Get Salon Profile
router.get('/profile/:salonId', async (req, res) => {
  try {
    const { salonId } = req.params;
    const salonDoc = await db.collection('salons').doc(salonId).get();
    
    if (!salonDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    res.json({
      success: true,
      salon: { id: salonDoc.id, ...salonDoc.data() }
    });
  } catch (error) {
    console.error('Get salon profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get salon profile',
      error: error.message
    });
  }
});

// Update Salon Profile
router.put('/profile/:salonId', authenticateToken, async (req, res) => {
  try {
    const { salonId } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    // Check if user owns this salon
    const salonDoc = await db.collection('salons').doc(salonId).get();
    if (!salonDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    if (salonDoc.data().ownerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this salon'
      });
    }

    await db.collection('salons').doc(salonId).update(updateData);
    
    res.json({
      success: true,
      message: 'Salon profile updated successfully'
    });
  } catch (error) {
    console.error('Update salon profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update salon profile',
      error: error.message
    });
  }
});

// Update Salon Owner Profile and Sync with Salon
router.put('/owner-profile/:ownerId', authenticateToken, isSalonOwner, async (req, res) => {
  try {
    const { ownerId } = req.params;
    const updateData = req.body;

    console.log('Syncing salon owner profile:', { ownerId, updateData, userId: req.user.userId });

    // Check if user is updating their own profile
    if (req.user.userId !== ownerId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this profile'
      });
    }

    // Update salon owner profile
    await db.collection('salonOwners').doc(ownerId).update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Find and update the corresponding salon entry
    const salonSnapshot = await db.collection('salons').where('ownerId', '==', ownerId).get();
    
    if (!salonSnapshot.empty) {
      const salonDoc = salonSnapshot.docs[0];
      const salonUpdateData = {};

      // Map salon owner fields to salon fields
      if (updateData.salonName) salonUpdateData.name = updateData.salonName;
      if (updateData.salonAddress) salonUpdateData.address = updateData.salonAddress;
      if (updateData.phoneNumber) salonUpdateData.phone = updateData.phoneNumber;
      if (updateData.email) salonUpdateData.email = updateData.email;
      if (updateData.city) salonUpdateData.city = updateData.city;
      if (updateData.state) salonUpdateData.state = updateData.state;
      if (updateData.pincode) salonUpdateData.pincode = updateData.pincode;
      if (updateData.servicesOffered) {
        // Handle servicesOffered as either string or array
        const servicesArray = Array.isArray(updateData.servicesOffered) 
          ? updateData.servicesOffered 
          : updateData.servicesOffered ? updateData.servicesOffered.split(',').map(s => s.trim()).filter(s => s) 
          : [];

        salonUpdateData.services = servicesArray.map(service => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: service,
          description: service,
          duration: 60,
          price: 0,
          category: 'general',
          isActive: true,
          createdAt: new Date()
        }));
        salonUpdateData.description = `Salon offering ${servicesArray.join(', ')}`;
      }
      if (updateData.openHours) salonUpdateData.workingHours = updateData.openHours;
      if (updateData.profileImage) salonUpdateData.images = [updateData.profileImage];

      if (Object.keys(salonUpdateData).length > 0) {
        salonUpdateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        await db.collection('salons').doc(salonDoc.id).update(salonUpdateData);
        console.log('Updated salon search data:', salonUpdateData);
      }
    }

    res.json({
      success: true,
      message: 'Profile updated successfully and synced with salon search data'
    });
  } catch (error) {
    console.error('Update owner profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Delete Salon
router.delete('/:salonId', authenticateToken, async (req, res) => {
  try {
    const { salonId } = req.params;
    
    const salonDoc = await db.collection('salons').doc(salonId).get();
    if (!salonDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    if (salonDoc.data().ownerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this salon'
      });
    }

    await db.collection('salons').doc(salonId).delete();
    
    res.json({
      success: true,
      message: 'Salon deleted successfully'
    });
  } catch (error) {
    console.error('Delete salon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete salon',
      error: error.message
    });
  }
});

// Test endpoint to create a sample salon
router.post('/test-create', async (req, res) => {
  try {
    const sampleSalonData = {
      ownerId: 'test-owner-id',
      name: 'Test Salon',
      description: 'A test salon for development',
      address: '123 Test Street, Test City',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      phone: '+1234567890',
      email: 'test@salon.com',
      services: [
        {
          id: 'service-1',
          name: 'Hair Cut',
          description: 'Professional hair cutting service',
          duration: 30,
          price: 500,
          category: 'hair',
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'service-2',
          name: 'Facial',
          description: 'Relaxing facial treatment',
          duration: 60,
          price: 800,
          category: 'facial',
          isActive: true,
          createdAt: new Date()
        }
      ],
      workingHours: {
        monday: { open: '09:00', close: '18:00', isOpen: true },
        tuesday: { open: '09:00', close: '18:00', isOpen: true },
        wednesday: { open: '09:00', close: '18:00', isOpen: true },
        thursday: { open: '09:00', close: '18:00', isOpen: true },
        friday: { open: '09:00', close: '18:00', isOpen: true },
        saturday: { open: '10:00', close: '16:00', isOpen: true },
        sunday: { open: '10:00', close: '16:00', isOpen: false }
      },
      images: [],
      isActive: true,
      isOpen: true,
      rating: 4.5,
      totalReviews: 10,
      waitingList: 2,
      maxCapacity: 15,
      hasAC: true,
      distance: '1.2 km',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const salonRef = await db.collection('salons').add(sampleSalonData);
    
    res.json({
      success: true,
      message: 'Test salon created successfully',
      salonId: salonRef.id
    });
  } catch (error) {
    console.error('Test salon creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test salon',
      error: error.message
    });
  }
});

// Get All Salons (for customers)
router.get('/all', async (req, res) => {
  try {
    const { city, service, page = 1, limit = 50 } = req.query; // Increased limit to get more salons
    console.log('Get all salons request:', { city, service, page, limit });
    
    // First, get all salons without the isActive filter to see what's in the database
    let query = db.collection('salons');
    
    if (city) {
      query = query.where('city', '==', city);
    }
    
    const snapshot = await query.get();
    console.log('Found salons in database:', snapshot.size);
    
    let salons = [];
    
    snapshot.forEach(doc => {
      const salonData = doc.data();
      console.log('Salon data:', { 
        id: doc.id, 
        name: salonData.name, 
        city: salonData.city, 
        isActive: salonData.isActive,
        isOpen: salonData.isOpen 
      });
      
      // Only include active salons in the results
      if (salonData.isActive !== false) {
        if (service) {
          // Filter by service if specified
          const hasService = salonData.services && salonData.services.some(s => 
            s.name.toLowerCase().includes(service.toLowerCase())
          );
          if (hasService) {
            salons.push({ id: doc.id, ...salonData });
          }
        } else {
          salons.push({ id: doc.id, ...salonData });
        }
      }
    });

    console.log('Active salons after filtering:', salons.length);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedSalons = salons.slice(startIndex, endIndex);

    console.log('Returning salons:', paginatedSalons.length);

    res.json({
      success: true,
      salons: paginatedSalons,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(salons.length / limit),
        totalSalons: salons.length,
        hasNext: endIndex < salons.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all salons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get salons',
      error: error.message
    });
  }
});

// Get Owner's Salons
router.get('/my-salons', authenticateToken, async (req, res) => {
  try {
    const snapshot = await db.collection('salons')
      .where('ownerId', '==', req.user.userId)
      .get();
    
    const salons = [];
    snapshot.forEach(doc => {
      salons.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      success: true,
      salons
    });
  } catch (error) {
    console.error('Get my salons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get your salons',
      error: error.message
    });
  }
});

// Task 2.1: Salon Services Management

// Add Service to Salon
router.post('/:salonId/services', authenticateToken, async (req, res) => {
  try {
    const { salonId } = req.params;
    const { name, description, duration, price, category } = req.body;

    const salonDoc = await db.collection('salons').doc(salonId).get();
    if (!salonDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    if (salonDoc.data().ownerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to add services to this salon'
      });
    }

    const serviceData = {
      id: Date.now().toString(),
      name,
      description,
      duration, // in minutes
      price,
      category,
      isActive: true,
      createdAt: new Date()
    };

    const salonRef = db.collection('salons').doc(salonId);
    await salonRef.update({
      services: [...salonDoc.data().services, serviceData],
      updatedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Service added successfully',
      service: serviceData
    });
  } catch (error) {
    console.error('Add service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add service',
      error: error.message
    });
  }
});

// Update Service
router.put('/:salonId/services/:serviceId', authenticateToken, async (req, res) => {
  try {
    const { salonId, serviceId } = req.params;
    const updateData = req.body;

    const salonDoc = await db.collection('salons').doc(salonId).get();
    if (!salonDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    if (salonDoc.data().ownerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update services in this salon'
      });
    }

    const services = salonDoc.data().services.map(service => 
      service.id === serviceId 
        ? { ...service, ...updateData, updatedAt: new Date() }
        : service
    );

    await db.collection('salons').doc(salonId).update({
      services,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
});

// Delete Service
router.delete('/:salonId/services/:serviceId', authenticateToken, async (req, res) => {
  try {
    const { salonId, serviceId } = req.params;

    const salonDoc = await db.collection('salons').doc(salonId).get();
    if (!salonDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    if (salonDoc.data().ownerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete services from this salon'
      });
    }

    const services = salonDoc.data().services.filter(service => service.id !== serviceId);

    await db.collection('salons').doc(salonId).update({
      services,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
});

// Task 2.1: Salon Images & Gallery

// Add Images to Salon Gallery
router.post('/:salonId/images', authenticateToken, async (req, res) => {
  try {
    const { salonId } = req.params;
    const { images } = req.body; // Array of image URLs

    const salonDoc = await db.collection('salons').doc(salonId).get();
    if (!salonDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    if (salonDoc.data().ownerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to add images to this salon'
      });
    }

    const currentImages = salonDoc.data().images || [];
    const newImages = images.map((url, index) => ({
      id: Date.now().toString() + index,
      url,
      uploadedAt: new Date()
    }));

    await db.collection('salons').doc(salonId).update({
      images: [...currentImages, ...newImages],
      updatedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Images added successfully',
      images: newImages
    });
  } catch (error) {
    console.error('Add images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add images',
      error: error.message
    });
  }
});

// Delete Image from Gallery
router.delete('/:salonId/images/:imageId', authenticateToken, async (req, res) => {
  try {
    const { salonId, imageId } = req.params;

    const salonDoc = await db.collection('salons').doc(salonId).get();
    if (!salonDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    if (salonDoc.data().ownerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete images from this salon'
      });
    }

    const images = salonDoc.data().images.filter(img => img.id !== imageId);

    await db.collection('salons').doc(salonId).update({
      images,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

// Task 2.2: Salon Availability & Scheduling

// Update Working Hours
router.put('/:salonId/working-hours', authenticateToken, async (req, res) => {
  try {
    const { salonId } = req.params;
    const { workingHours } = req.body;

    const salonDoc = await db.collection('salons').doc(salonId).get();
    if (!salonDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    if (salonDoc.data().ownerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update working hours for this salon'
      });
    }

    await db.collection('salons').doc(salonId).update({
      workingHours,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Working hours updated successfully'
    });
  } catch (error) {
    console.error('Update working hours error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update working hours',
      error: error.message
    });
  }
});

// Set Holiday/Break Time
router.post('/:salonId/holidays', authenticateToken, async (req, res) => {
  try {
    const { salonId } = req.params;
    const { date, reason, isFullDay, startTime, endTime } = req.body;

    const salonDoc = await db.collection('salons').doc(salonId).get();
    if (!salonDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    if (salonDoc.data().ownerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to set holidays for this salon'
      });
    }

    const holidayData = {
      id: Date.now().toString(),
      date,
      reason,
      isFullDay,
      startTime,
      endTime,
      createdAt: new Date()
    };

    const holidays = salonDoc.data().holidays || [];
    holidays.push(holidayData);

    await db.collection('salons').doc(salonId).update({
      holidays,
      updatedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Holiday set successfully',
      holiday: holidayData
    });
  } catch (error) {
    console.error('Set holiday error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set holiday',
      error: error.message
    });
  }
});

// Update Real-time Availability Status
router.put('/:salonId/availability', authenticateToken, async (req, res) => {
  try {
    const { salonId } = req.params;
    const { isAvailable, status, message } = req.body;

    const salonDoc = await db.collection('salons').doc(salonId).get();
    if (!salonDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    if (salonDoc.data().ownerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update availability for this salon'
      });
    }

    await db.collection('salons').doc(salonId).update({
      isAvailable,
      status,
      statusMessage: message,
      lastStatusUpdate: new Date(),
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Availability status updated successfully'
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update availability status',
      error: error.message
    });
  }
});

// Get Salon Availability
router.get('/:salonId/availability', async (req, res) => {
  try {
    const { salonId } = req.params;
    const { date } = req.query;

    const salonDoc = await db.collection('salons').doc(salonId).get();
    if (!salonDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    const salonData = salonDoc.data();
    const workingHours = salonData.workingHours || {};
    const holidays = salonData.holidays || [];
    const isAvailable = salonData.isAvailable !== false;

    // Check if the requested date is a holiday
    const isHoliday = holidays.some(holiday => 
      holiday.date === date && (holiday.isFullDay || 
        (holiday.startTime && holiday.endTime))
    );

    res.json({
      success: true,
      availability: {
        isAvailable,
        workingHours,
        holidays,
        isHoliday,
        status: salonData.status || 'open',
        statusMessage: salonData.statusMessage
      }
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get availability',
      error: error.message
    });
  }
});

module.exports = router; 