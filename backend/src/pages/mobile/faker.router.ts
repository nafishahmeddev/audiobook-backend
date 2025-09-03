import { Router } from "express";
import { Album, Author, Genre, List, Track } from "../../db/default";
import ResponseHelper from "../../helpers/ResponseHelper";
import { faker } from "@faker-js/faker";
import axios from "axios";
import fs from "fs";
import { ALBUM_TYPE_ENUM, TRACK_TYPE_ENUM } from "../../enums/album";
import { exec } from "child_process";
import ffmpeg from "fluent-ffmpeg";

const router = Router({ mergeParams: true });
function art(): string {
  const arts = fs.readdirSync(process.env.PROJECT_PATH + "/dummy/cover");
  return (
    process.env.PROJECT_PATH +
    "/dummy/cover" +
    "/" +
    arts[Math.floor(Math.random() * arts.length)]
  );
}
function userPhoto(): string {
  const arts = fs.readdirSync(process.env.PROJECT_PATH + "/dummy/avatar");
  return (
    process.env.PROJECT_PATH +
    "/dummy/avatar" +
    "/" +
    arts[Math.floor(Math.random() * arts.length)]
  );
}
router.patch("/generate", async (req: any, res: any) => {
  res.status(200).json(
    ResponseHelper.success({
      code: 200,
      message: "Successful",
    })
  );

  // return res.send("Currently turned off....");
  fs.readdirSync(`${process.env.ASSETS_PATH}/public/images`).forEach((e) =>
    fs.rmSync(`${process.env.ASSETS_PATH}/public/images/` + e)
  );
  fs.readdirSync(`${process.env.ASSETS_PATH}/public/audios`).forEach((e) =>
    fs.rmSync(`${process.env.ASSETS_PATH}/public/audios/` + e, { recursive: true })
  );

  await Author.deleteMany({ _id: { $ne: null } });
  await Genre.deleteMany({ _id: { $ne: null } });
  await List.deleteMany({ _id: { $ne: null } });
  await Album.deleteMany({ _id: { $ne: null } });
  await Track.deleteMany({ _id: { $ne: null } });

  console.log("Generating authors....");
  for (let n = 0; n < 20; n++) {
    const author = new Author({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      gender: faker.person.gender(),
      description: faker.lorem.sentence(),
      dob: Date(),
      dod: Date(),
    });
    const filepath = `${process.env.ASSETS_PATH
      }/public/images/author-${author._id.toString()}-${Date.now()}.jpg`;
    fs.cpSync(userPhoto(), filepath);
    author.image = filepath.replace(process.env.ASSETS_PATH ?? "", "");
    await author.save();
    console.log(`Generated author ${n}....`);
  }

  console.log("Generating genre....");
  for (let n = 0; n < 10; n++) {
    const genre =
      (await Genre.findOne({
        name: faker.music.genre(),
      })) ??
      new Genre({
        name: faker.music.genre(),
      });

    const filepath = `${process.env.ASSETS_PATH
      }/public/images/genre-${genre._id.toString()}-${Date.now()}.jpg`;
    fs.cpSync(art(), filepath);
    genre.thumbnail = filepath.replace(process.env.ASSETS_PATH ?? "", "");
    await genre.save();
    console.log(`Generated genres ${n}....`);
  }

  console.log("Generating lists....");
  for (let n = 0; n < 20; n++) {
    const list = new List({
      name: faker.company.name(),
      subtitle: faker.commerce.department(),
    });
    const filepath = `${process.env.ASSETS_PATH
      }/public/images/list-${list._id.toString()}-${Date.now()}.jpg`;
    fs.cpSync(art(), filepath);
    list.thumbnail = filepath.replace(process.env.ASSETS_PATH ?? "", "");
    await list.save();
    console.log(`Generated list ${n}....`);
  }

  console.log("Generating albums....");
  for (let n = 0; n < 30; n++) {
    const album: any = new Album({
      title: faker.company.name(),
      excerpt: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      language: "en",
      duration: Math.ceil(Math.random() * 100000),
      authors: await Author.aggregate([{ $sample: { size: 1 } }]),
      genres: await Genre.aggregate([{ $sample: { size: 1 } }]),
      lists: await List.aggregate([{ $sample: { size: 1 } }]),
      type: ALBUM_TYPE_ENUM.ALBUM,
    });
    const filepath = `${process.env.ASSETS_PATH
      }/public/images/album-${album._id.toString()}-${Date.now()}.jpg`;
    fs.cpSync(art(), filepath);
    album.thumbnail = filepath.replace(process.env.ASSETS_PATH ?? "", "");
    await album.save();
    console.log(`Generated album ${n}....`);
  }

  console.log("Generating tracks....");
  for (let n = 0; n < 100; n++) {
    const track: any = new Track({
      title: faker.music.songName(),
      excerpt: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      language: "en",
      duration: Math.ceil(Math.random() * 100000),
      authors: await Author.aggregate([{ $sample: { size: 2 } }]),
      genres: await Genre.aggregate([{ $sample: { size: 2 } }]),
      lists: await List.aggregate([{ $sample: { size: 2 } }]),
      type: TRACK_TYPE_ENUM.SONG,
      album: (await Album.aggregate([{ $sample: { size: 1 } }]))[0],
    });
    const filepath = `${process.env.ASSETS_PATH}/public/images/track-${track._id.toString()}-${Date.now()}.jpg`;
    fs.cpSync(art(), filepath);
    track.thumbnail = filepath.replace(process.env.ASSETS_PATH ?? "", "");

    const sourcePath = `${process.env.PROJECT_PATH}/dummy/audio/test.mp3`;
    const audioPath = `${process.env.ASSETS_PATH}/public/audios/${track._id.toString()}.aac`;

    try {
      await new Promise((resolve, reject) => {
        ffmpeg(sourcePath, { timeout: 432000 }) // timeout in ms for ffmpeg processing
          .addOptions([
            "-map 0:a", // select all audio streams from the input
            "-c:a aac", // encode audio using the AAC codec
            "-b:a 128k", // set audio bitrate to 128 kbps
            "-f adts" // output format: ADTS (Audio Data Transport Stream)
          ])
          .saveToFile(audioPath)
          .on("error", (error) => {
            console.error(`exec error: ${error.message}`);
            reject(false);
          })
          .on("progress", (command) => {
            console.log("exec progress: ", command);
          })
          .on("end", (stdout, stderr) => {
            console.log(`stdout: ${stdout}`);
            resolve(true);
          });
      });

      track.audio = audioPath.replace(process.env.ASSETS_PATH || "", "");
      await track.save();
      console.log(`Generated track ${n}....`);
    } catch (err) {
      console.log(`Generated not possible track ${n}....`);
    }
  }

  // return res.status(200).json(
  //   ResponseHelper.success({
  //     code: 200,
  //     message: "Successful",
  //   })
  // );
});

export default router;
