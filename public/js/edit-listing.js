// Generated by IcedCoffeeScript 1.2.0t
(function() {

  head.ready(function() {
    var $documentBody, $tabs, PHOTOS_INDEX, POSTITEM_DETAIL_INDEX, VIDEO_INDEX, VOICE_INDEX, map, marker, model, postitem, postitemID, previousPostItem, removeFilesFromUPloader, setupMap, setupUploaders;
    POSTITEM_DETAIL_INDEX = 0;
    PHOTOS_INDEX = 1;
    VIDEO_INDEX = 2;
    VOICE_INDEX = 3;
    $documentBody = jQuery("body");
    postitem = JSON.parse(jQuery("div#current-postitem").text().trim());
    postitemID = postitem._id;
    map = null;
    marker = null;
    $tabs = jQuery("div#listing-edit").tabs({
      create: function(event, ui) {
        setTimeout(function() {
          return setupMap();
        }, 3000);
        event.preventDefault();
        return $documentBody.on("modelInitialized", function(event, model) {
          console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; " + JSON.stringify(model));
          return setupUploaders(model);
        });
      },
      show: function(event, ui) {
        console.log("show ++++++++++++++++++++++++++++++++++");
        return event.preventDefault();
      },
      cache: true,
      collapsible: false,
      select: function(event, ui) {
        var index;
        index = ui.index;
        switch (index) {
          case POSTITEM_DETAIL_INDEX:
            console.log("POSTITEM_DETAIL_INDEX");
            return L.Util.requestAnimFrame(map.invalidateSize, map, !1, map._container);
          case PHOTOS_INDEX:
            return console.log("PHOTOS_INDEX");
          case VIDEO_INDEX:
            return console.log("VIDEO_INDEX");
          case VOICE_INDEX:
            return console.log("VOICE_INDEX");
          default:
            return console.log("INDEX ERROR");
        }
      }
    });
    $tabs.tabs('select', POSTITEM_DETAIL_INDEX);
    setupMap = function() {
      var changeLocation, popup, showLocation;
      map = L.map('map', {
        doubleClickZoom: false
      }).setView(postitem.location, 8);
      L.tileLayer('http://{s}.tile.cloudmade.com/552ed20c2dcf46d49a048d782d8b37e6/997/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
      }).addTo(map);
      marker = L.marker(postitem.location, {
        draggable: true,
        clickable: true
      }).addTo(map);
      popup = L.popup();
      showLocation = function(event) {
        var latitude, latlng, longitude, target;
        target = null;
        if (event.hasOwnProperty("target")) target = event.target;
        latlng = event.latlng || target.getLatLng();
        latitude = latlng.lat;
        longitude = latlng.lng;
        return jQuery.ajax({
          url: "http://open.mapquestapi.com/geocoding/v1/reverse?lat={0}&lng={1}".format(latitude, longitude),
          dataType: 'jsonp',
          success: function(response) {
            var city, country, location, neighborhood, state;
            if (response.results[0]) location = response.results[0].locations[0];
            if (location) {
              neighborhood = location.street || "Not Available";
              city = location.adminArea5 || "";
              state = location.adminArea3 || "";
              country = location.adminArea1 || "";
              if (city && country) {
                map.closePopup();
                popup.setLatLng(latlng).setContent("The location clicked is {0}, {1}".format(city, country)).openOn(map);
                return setTimeout(function() {
                  return map.closePopup();
                }, 12000);
              } else {
                return console.log("error");
              }
            } else {
              return console.log("error");
            }
          },
          error: function(error) {
            return alert("Error");
          }
        });
      };
      changeLocation = function(event) {
        var latitude, latlng, longitude, target;
        target = null;
        if (event.hasOwnProperty("target")) target = event.target;
        latlng = event.latlng || target.getLatLng();
        latitude = latlng.lat;
        longitude = latlng.lng;
        return jQuery.ajax({
          url: "http://open.mapquestapi.com/geocoding/v1/reverse?lat={0}&lng={1}".format(latitude, longitude),
          dataType: 'jsonp',
          success: function(response) {
            var city, country, location, neighborhood, state;
            if (response.results[0]) location = response.results[0].locations[0];
            if (location) {
              neighborhood = location.street || "Not Available";
              city = location.adminArea5 || "";
              state = location.adminArea3 || city;
              country = location.adminArea1 || "";
              if (city && country) {
                map.closePopup();
                popup.setLatLng(latlng).setContent("You have updated your location to {0}, {1}".format(city, country)).openOn(map);
                setTimeout(function() {
                  return map.closePopup();
                }, 12000);
                marker.setLatLng(latlng);
                model.location([latitude, longitude]);
                model.address.city(city);
                model.address.state(state);
                model.address.country(country);
                return model.address.neighborhood(neighborhood);
              } else {
                return console.log("error");
              }
            } else {
              return console.log("error");
            }
          },
          error: function(error) {
            return alert("Error");
          }
        });
      };
      marker.on("dragend", changeLocation);
      marker.on("click", showLocation);
      map.on("click", showLocation);
      return map.on("dblclick", changeLocation);
    };
    setupUploaders = function(model) {
      var $photoFileUpload, $videoFileUpload, $voiceFileUpload, numberOfPhotosUploaded, numberOfVideoUploaded, numberOfVoiceUploaded, onError, onRemove, onSelect, onSuccess, onUpload, photoFileUploader, _ref, _ref2;
      $photoFileUpload = jQuery("input.media-input-listing-edit-photo");
      $photoFileUpload.kendoUpload({
        localization: {
          select: "Photos"
        },
        success: function(event) {
          return onSuccess(event, "photos");
        },
        error: function(event) {
          return onError(event, "photos");
        },
        upload: function(event) {
          return onUpload(event, "photos");
        },
        select: function(event) {
          return onSelect(event, "photos");
        },
        remove: function(event) {
          return onRemove(event, "photos");
        }
      });
      photoFileUploader = $photoFileUpload.data("kendoUpload");
      $videoFileUpload = jQuery("input#media-input-listing-video");
      $voiceFileUpload = jQuery("input#media-input-listing-voice");
      numberOfPhotosUploaded = model.numberOfPhotos();
      numberOfVideoUploaded = (_ref = model.video) != null ? _ref : {
        1: 0
      };
      numberOfVoiceUploaded = (_ref2 = model.voice) != null ? _ref2 : {
        1: 0
      };
      onSuccess = function(event, type) {
        return console.log(type + " success");
      };
      onError = function(event, type) {
        return console.log(type + " error");
      };
      onUpload = function(event, type) {
        var files;
        files = event.files;
        console.log("select " + files + type);
        switch (type) {
          case "photos":
            return console.log("onUpload");
          case "video":
            return console.log("onUpload");
          case "voice":
            return console.log("onUpload");
          default:
            return console.log("error type is not of photos or video or voice.");
        }
      };
      onSelect = function(event, type) {
        var files, len;
        files = event.files;
        len = files.length;
        console.log("select " + files + type);
        switch (type) {
          case "photos":
            if (numberOfPhotosUploaded < 4) {
              jQuery.each(files, function(index, file) {
                if (jQuery.inArray(file.extension.toLowerCase(), [".gif", ".png", ".jpeg", ".jpg", ".bmp"]) === -1) {
                  event.preventDefault();
                }
                if (file.size > 246800) return console.log("file is too big");
              });
              return numberOfPhotosUploaded = numberOfPhotosUploaded + len;
            } else {
              return event.preventDefault();
            }
            break;
          case "video":
            if (numberOfVideoUploaded < 1) {
              jQuery.each(files, function(index, file) {
                if (jQuery.inArray(file.extension.toLowerCase(), [".mp4", ".mpeg", ".mov", ".x-msvideo", ".avi", ".msvideo", ".x-msvideo", ".3gpp", ".mpeg", ".quicktime", ".MP2P", ".MP1S", ".x-flv"]) === -1) {
                  event.preventDefault();
                }
                if (file.size > 1024000) {
                  console.log("file is too big");
                  return event.preventDefault();
                }
              });
              return numberOfVideoUploaded = numberOfVideoUploaded + len;
            } else {
              return event.preventDefault();
            }
            break;
          case "voice":
            if (numberOfVoiceUploaded < 1) {
              jQuery.each(files, function(index, file) {
                if (jQuery.inArray(file.extension.toLowerCase(), [".mp3"]) === -1) {
                  event.preventDefault();
                }
                if (file.size > 1024000) {
                  console.log("file is too big");
                  return event.preventDefault();
                }
              });
              return numberOfVoiceUploaded = numberOfVoiceUploaded + len;
            } else {
              return event.preventDefault();
            }
            break;
          default:
            return console.log("error type is not of photos or video or voice.");
        }
      };
      return onRemove = function(event, type) {
        var files, len;
        files = event.files;
        len = files.length;
        switch (type) {
          case "photos":
            return numberOfPhotosUploaded = numberOfPhotosUploaded - len;
          case "video":
            return numberOfVideoUploaded = numberOfVideoUploaded - len;
          case "voice":
            return numberOfVoiceUploaded = numberOfVoiceUploaded - len;
          default:
            return console.log("error type is not of photos or video or voice.");
        }
      };
    };
    if (!postitem) {
      console.log("error with parsing postitem");
      return;
    }
    model = ko.mapping.fromJS(postitem);
    previousPostItem = postitem;
    console.log("------------------ " + JSON.stringify(postitem.photos[0]));
    console.log("------------------ " + JSON.stringify(model.photos()));
    console.log(model.exchangeOptions());
    console.log("------------------ " + JSON.stringify(model.photos()));
    ko.validation.rules.pattern.message = 'Invalid.';
    ko.validation.configure({
      registerExtenders: true,
      messagesOnModified: true,
      insertMessages: true,
      parseInputAttributes: true,
      messageTemplate: null
    });
    model.email.extend({
      email: true,
      required: true
    });
    model.itemDescription.extend({
      required: true,
      minLength: 10
    });
    model.price.extend({
      min: 0,
      number: true
    });
    model.errors = ko.validation.group(model);
    model.numberOfProcessedPhotos = ko.computed(function() {
      var array, photos;
      array = this.photos();
      photos = _.reject(array, function(photo) {
        return _.isEmpty(photo) || photo === {} || photo === [{}];
      });
      console.log("numberOfProcessedPhotos " + this.photos().length);
      return this.photos().length;
    }, model);
    model.numberOfPhotosBeingProcessed = ko.computed(function() {
      var photosBeingProcessed;
      console.log("@numberOfPhotos() " + this.numberOfPhotos());
      console.log("@numberOfProcessedPhotos() " + this.numberOfProcessedPhotos());
      photosBeingProcessed = this.numberOfPhotos() - this.numberOfProcessedPhotos();
      return "You have {0} file(s) being processed.".format(photosBeingProcessed);
    }, model);
    model.exchangeOptionsString = ko.computed(function() {
      return this.exchangeOptions() || "n/a";
    }, model);
    model.mainImageDisplay = ko.computed(function() {
      var len;
      len = this.photos().length;
      if (len > 0) {
        return "/images/sampleImage_001_120x90.jpg";
      } else {
        return "/images/sampleImage_001_120x90.jpg";
      }
    }, model);
    model.createdDate = model.createdDate.extend({
      isoDate: 'mm/dd/yyyy'
    });
    model.deletePhoto = function(postitem, event) {
      return jQuery.confirm({
        'title': 'Delete Confirmation',
        'message': 'You are about to delete this item. <br />It cannot be restored at a later time! Continue?',
        'buttons': {
          'Yes': {
            'class': 'blue',
            'action': function() {
              var photoID, photos;
              console.log("yes");
              console.log(postitem);
              console.log(event.currentTarget.id);
              photoID = event.currentTarget.id;
              photos = model.photos();
              console.log("photos " + JSON.stringify(photos));
              photos = _.reject(photos, function(photo) {
                return photo._id() === photoID || _.isEmpty(photo);
              });
              console.log(JSON.stringify(photos));
              return model.photos(photos);
            }
          },
          'No': {
            'class': 'gray',
            'action': function() {
              return {};
            }
          }
        }
      });
    };
    model.deleteVideo = function(postitem, event) {
      return console.log("deleteVideo");
    };
    model.deleteVoice = function(postitem, event) {
      return console.log("deleteVoice");
    };
    model.updatePostItem = function(postitem, event) {
      if (model.errors() === 0) {
        alert('Thank you.');
      } else {
        model.errors.showAllMessages(true);
      }
      console.log(ko.mapping.toJS(postitem));
      return event.preventDefault();
    };
    model.cancelUpdatePostItem = function(postitem, event) {
      var location;
      model = ko.mapping.fromJS(previousPostItem, postitem);
      model.errors.showAllMessages(false);
      location = model.location();
      map.setView(location, 8);
      marker.setLatLng(location);
      marker.update();
      removeFilesFromUPloader();
      return event.preventDefault();
    };
    model.updateVideo = function(postitem, event) {
      console.log("updateVideo");
      removeFilesFromUPloader();
      return event.preventDefault();
    };
    model.cancelUpdateVideo = function(postitem, event) {
      console.log("cancelUpdateVideo");
      removeFilesFromUPloader();
      return event.preventDefault();
    };
    model.updateVoice = function(postitem, event) {
      console.log("updateVoice");
      removeFilesFromUPloader();
      return event.preventDefault();
    };
    model.cancelUpdateVoice = function(postitem, event) {
      console.log("cancelUpdateVoice");
      removeFilesFromUPloader();
      return event.preventDefault();
    };
    removeFilesFromUPloader = function() {
      return setTimeout(function() {
        return jQuery("ul.t-upload-files").remove();
      }, 1300);
    };
    ko.applyBindings(model, jQuery("#listing-edit")[0]);
    $documentBody.trigger("modelInitialized", model);
    return $documentBody.off("modelInitialized");
  });

}).call(this);
