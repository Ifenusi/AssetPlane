/**
 * Geo-Verification & Trust System - AssetPlane
 * Property location verification with drone footage authenticity checking
 */

class GeoVerificationSystem {
  constructor() {
    this.map = null;
    this.marker = null;
    this.streetView = null;
    this.currentLocation = { lat: 6.5244, lng: 3.3792 }; // Lagos default
    this.photoGPS = null;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initMap();
    this.setupFileUpload();
  }

  setupEventListeners() {
    // Address search
    document.getElementById('search-address')?.addEventListener('click', () => {
      this.searchAddress();
    });

    // Coordinates search
    document.getElementById('search-coords')?.addEventListener('click', () => {
      this.searchCoordinates();
    });

    // Map controls
    document.getElementById('toggle-satellite')?.addEventListener('click', () => {
      this.toggleSatelliteView();
    });

    document.getElementById('toggle-streetview')?.addEventListener('click', () => {
      this.toggleStreetView();
    });

    document.getElementById('reset-map')?.addEventListener('click', () => {
      this.resetMap();
    });

    // Enter key support for inputs
    document.getElementById('property-address')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.searchAddress();
    });

    document.getElementById('coordinates')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.searchCoordinates();
    });
  }

  initMap() {
    if (!window.google) {
      console.error('Google Maps API not loaded');
      this.showStatus('Google Maps API not available');
      return;
    }

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: this.currentLocation,
      zoom: 15,
      mapTypeId: 'hybrid',
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      streetViewControl: true,
    });

    this.marker = new google.maps.Marker({
      position: this.currentLocation,
      map: this.map,
      draggable: true,
      title: 'Property Location',
      icon: {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3oiIHN0cm9rZT0iIzFFQTdGRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSIjRkZGIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iOSIgcj0iMyIgZmlsbD0iIzFFQTdGRiIvPgo8L3N2Zz4K',
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 40)
      }
    });

    // Street View
    this.streetView = new google.maps.StreetViewPanorama(
      document.getElementById('street-view'),
      {
        position: this.currentLocation,
        pov: { heading: 0, pitch: 0 },
        visible: false
      }
    );

    this.map.setStreetView(this.streetView);

    // Handle marker drag
    this.marker.addListener('dragend', () => {
      const position = this.marker.getPosition();
      this.updateLocation(position.lat(), position.lng());
    });

    this.showStatus('Map initialized. Search for a property or drag the marker.');
  }

  setupFileUpload() {
    const fileInput = document.getElementById('drone-photo');
    const verifyBtn = document.getElementById('verify-photo');
    const clearBtn = document.getElementById('clear-photo');

    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type === 'image/jpeg') {
        verifyBtn.disabled = false;
      } else {
        verifyBtn.disabled = true;
        alert('Please select a JPG image file.');
      }
    });

    verifyBtn?.addEventListener('click', () => {
      this.verifyDronePhoto();
    });

    clearBtn?.addEventListener('click', () => {
      this.clearVerification();
    });
  }

  async searchAddress() {
    const address = document.getElementById('property-address')?.value;
    if (!address) {
      this.showStatus('Please enter an address');
      return;
    }

    try {
      const geocoder = new google.maps.Geocoder();
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0]);
          } else {
            reject(status);
          }
        });
      });

      const location = result.geometry.location;
      this.updateLocation(location.lat(), location.lng());
      this.showStatus(`Found: ${result.formatted_address}`);
    } catch (error) {
      this.showStatus(`Address not found: ${error}`);
    }
  }

  searchCoordinates() {
    const coords = document.getElementById('coordinates')?.value;
    if (!coords) {
      this.showStatus('Please enter coordinates');
      return;
    }

    const [lat, lng] = coords.split(',').map(c => parseFloat(c.trim()));
    if (isNaN(lat) || isNaN(lng)) {
      this.showStatus('Invalid coordinates format. Use: lat, lng');
      return;
    }

    this.updateLocation(lat, lng);
    this.showStatus(`Located coordinates: ${lat}, ${lng}`);
  }

  updateLocation(lat, lng) {
    this.currentLocation = { lat, lng };
    
    if (this.map) {
      this.map.setCenter(this.currentLocation);
      this.marker.setPosition(this.currentLocation);
    }
    
    if (this.streetView) {
      this.streetView.setPosition(this.currentLocation);
    }
  }

  toggleSatelliteView() {
    if (this.map) {
      const currentType = this.map.getMapTypeId();
      this.map.setMapTypeId(currentType === 'satellite' ? 'roadmap' : 'satellite');
    }
  }

  toggleStreetView() {
    if (this.streetView) {
      const isVisible = this.streetView.getVisible();
      this.streetView.setVisible(!isVisible);
      document.getElementById('street-view').style.display = isVisible ? 'none' : 'block';
    }
  }

  resetMap() {
    this.currentLocation = { lat: 6.5244, lng: 3.3792 };
    this.updateLocation(this.currentLocation.lat, this.currentLocation.lng);
    this.map.setZoom(15);
    this.showStatus('Map reset to Lagos');
  }

  async verifyDronePhoto() {
    const fileInput = document.getElementById('drone-photo');
    const file = fileInput?.files[0];
    
    if (!file) {
      alert('Please select a photo first');
      return;
    }

    try {
      // Read EXIF data
      const exifData = await this.readExifData(file);
      
      if (!exifData || !exifData.GPSLatitude || !exifData.GPSLongitude) {
        alert('No GPS data found in this photo. Please ensure GPS was enabled when the photo was taken.');
        return;
      }

      // Convert GPS coordinates
      const photoLat = this.convertDMSToDD(
        exifData.GPSLatitude,
        exifData.GPSLatitudeRef
      );
      const photoLng = this.convertDMSToDD(
        exifData.GPSLongitude,
        exifData.GPSLongitudeRef
      );

      this.photoGPS = { lat: photoLat, lng: photoLng };

      // Calculate distance
      const distance = this.calculateDistance(
        this.currentLocation.lat,
        this.currentLocation.lng,
        photoLat,
        photoLng
      );

      this.displayVerificationResults(photoLat, photoLng, distance);
      
    } catch (error) {
      console.error('Error verifying photo:', error);
      alert('Error processing photo. Please try another image.');
    }
  }

  readExifData(file) {
    return new Promise((resolve) => {
      EXIF.getData(file, function() {
        const exifData = {
          GPSLatitude: EXIF.getTag(this, 'GPSLatitude'),
          GPSLongitude: EXIF.getTag(this, 'GPSLongitude'),
          GPSLatitudeRef: EXIF.getTag(this, 'GPSLatitudeRef'),
          GPSLongitudeRef: EXIF.getTag(this, 'GPSLongitudeRef')
        };
        resolve(exifData);
      });
    });
  }

  convertDMSToDD(dms, ref) {
    if (!dms) return 0;
    
    const degrees = dms[0];
    const minutes = dms[1];
    const seconds = dms[2];
    
    let dd = degrees + minutes / 60 + seconds / 3600;
    
    if (ref === 'S' || ref === 'W') {
      dd = -dd;
    }
    
    return dd;
  }

  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    
    const a = Math.sin
