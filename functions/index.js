const functions = require("firebase-functions");
const admin = require("firebase-admin");
const mkdirp = require("mkdirp");
const spawn = require("child-process-promise").spawn;
const path = require("path");
const os = require("os");
const fs = require("fs");
const cors = require("cors")({
  origin: true
});

admin.initializeApp();

// File extension for the created JPEG files.
//const JPEG_EXTENSION = ".jpg";

///**
// * When an image is uploaded in the Storage bucket it is converted to JPEG automatically using
// * ImageMagick.
// */
//exports.imageToJPG = functions.storage.object().onFinalize(async (object) => {
//  const filePath = object.name;
//  const baseFileName = path.basename(filePath, path.extname(filePath));
//  const fileDir = path.dirname(filePath);
//  const JPEGFilePath = path.normalize(path.format({dir: fileDir, name: baseFileName, ext: JPEG_EXTENSION}));
//  const tempLocalFile = path.join(os.tmpdir(), filePath);
//  const tempLocalDir = path.dirname(tempLocalFile);
//  const tempLocalJPEGFile = path.join(os.tmpdir(), JPEGFilePath);
//
//  // Exit if this is triggered on a file that is not an image.
//  if (!object.contentType.startsWith('image/')) {
//    console.log('This is not an image.');
//    return null;
//  }
//
//  // Exit if the image is already a JPEG.
//  if (object.contentType.startsWith('image/jpeg')) {
//    console.log('Already a JPEG.');
//    return null;
//  }
//
//  const bucket = admin.storage().bucket(object.bucket);
//
//  // Create the temp directory where the storage file will be downloaded.
//  await mkdirp(tempLocalDir);
//
//  // Download file from bucket.
//  await bucket.file(filePath).download({destination: tempLocalFile});
//  console.log('The file has been downloaded to', tempLocalFile);
//
//  // Convert the image to JPEG using ImageMagick.
//  await spawn('convert', [tempLocalFile, tempLocalJPEGFile]);
//  console.log('JPEG image created at', tempLocalJPEGFile);
//
//  // Uploading the JPEG image.
//  await bucket.upload(tempLocalJPEGFile, {destination: JPEGFilePath});
//  console.log('JPEG image uploaded to Storage at', JPEGFilePath);
//
//  // Once the image has been converted delete the local files to free up disk space.
//  fs.unlinkSync(tempLocalJPEGFile);
//  fs.unlinkSync(tempLocalFile);
//  return null;
//});

const { Storage } = require("@google-cloud/storage");
const storage = new Storage();

/**
 * Parses a 'multipart/form-data' upload request
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */

// Node.js doesn't have a built-in multipart/form-data parsing library.
// Instead, we can use the 'busboy' library from NPM to parse these requests.
const Busboy = require("busboy");

exports.uploadFile = (req, res) => {
  if (req.method !== "POST") {
    // Return a "method not allowed" error
    return res.status(405).end();
  }
  const busboy = new Busboy({ headers: req.headers });
  const tmpdir = os.tmpdir();

  // This object will accumulate all the fields, keyed by their name
  const fields = {};

  // This object will accumulate all the uploaded files, keyed by their name.
  const uploads = {};

  // This code will process each non-file field in the form.
  busboy.on("field", (fieldname, val) => {
    // TODO(developer): Process submitted field values here
    console.log(`Processed field ${fieldname}: ${val}.`);
    fields[fieldname] = val;
  });

  const fileWrites = [];

  // This code will process each file uploaded.
  busboy.on("file", (fieldname, file, filename) => {
    // Note: os.tmpdir() points to an in-memory file system on GCF
    // Thus, any files in it must fit in the instance's memory.
    console.log(`Processed file ${filename}`);
    const filepath = path.join(tmpdir, filename);
    uploads[fieldname] = filepath;

    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    // File was processed by Busboy; wait for it to be written.
    // Note: GCF may not persist saved files across invocations.
    // Persistent files must be kept in other locations
    // (such as Cloud Storage buckets).
    const promise = new Promise((resolve, reject) => {
      file.on("end", () => {
        writeStream.end();
      });
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
    fileWrites.push(promise);
  });

  // Triggered once all uploaded files are processed by Busboy.
  // We still need to wait for the disk writes (saves) to complete.
  busboy.on("finish", async () => {
    await Promise.all(fileWrites);

    // TODO(developer): Process saved files here
    for (const file in uploads) {
      fs.unlinkSync(uploads[file]);
    }
    res.send();
  });

  busboy.end(req.rawBody);
};

/**
 * HTTP function that generates a signed URL
 * The signed URL can be used to upload files to Google Cloud Storage (GCS)
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.getSignedUrl = (req, res) => {
  if (req.method !== "POST") {
    // Return a "method not allowed" error
    return res.status(405).end();
  }
  // TODO(developer) check that the user is authorized to upload

  // Get a reference to the destination file in GCS
  const file = storage.bucket(req.body.bucket).file(req.body.filename);

  // Create a temporary upload URL
  const expiresAtMs = Date.now() + 300000; // Link expires in 5 minutes
  const config = {
    action: "write",
    expires: expiresAtMs,
    contentType: req.body.contentType
  };

  file.getSignedUrl(config, (err, url) => {
    if (err) {
      console.error(err);
      res.status(500).end();
      return;
    }
    res.send(url);
  });
};

exports.nat = functions.https.onRequest((req, res) => {
  cors((req, res, () => {
    res.send("Hello Firebase Cloud Function!");
  }));
});

exports.nat2 = functions.https.onRequest((req, res) => {
  cors((req, res, () => {
    res.status(200).send("Hello Firebase Cloud Function!");
  }));
});

//exports.nat = functions.https.onRequest(cors((req, res) => {
//    console.log("nat");
//    if (req.method !== "POST") {
//      return res.status(500).send({
//        message: "Not allowed"
//      });
//    } else {
//      return res.status(200).send({
//        message: "Dummy"
//      });
//    }
//    //await admin
//    //  .firestore()
//    //  .doc(`userProfile/1`)
//    //  .set({
//    //    teamAdmin: false
//    //  });
//    //return res.status(200).send("dummy");
//  })
//);

exports.uploadFile2 = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(500).json({
        message: "Not allowed"
      });
    }
    const busboy = new Busboy({ headers: req.headers });
    let uploadData = null;

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const filepath = path.join(os.tmpdir(), filename);
      uploadData = { file: filepath, type: mimetype };
      file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on("finish", () => {
      //  const bucket = admin.storage().bucket(object.bucket);
      const bucket = admin.storage().bucket("hello");
      bucket
        .upload(uploadData.file, {
          uploadType: "media",
          metadata: {
            metadata: {
              contentType: uploadData.type
            }
          }
        })
        .then(() => {
          return res.status(200).json({
            message: "It worked!"
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
    busboy.end(req.rawBody);
  });
});
