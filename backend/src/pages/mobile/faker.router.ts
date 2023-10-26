import { Router } from "express";
import { Album, Author, Genre, List, Track } from "../../db/default";
import ResponseHelper from "../../helpers/ResponseHelper";
import { faker } from '@faker-js/faker';
import axios from "axios";
import fs from "fs";
import { ALBUM_TYPE_ENUM, TRACK_TYPE_ENUM } from "../../enums/album";


const router = Router({ mergeParams: true });
async function download(url: string, outPath: string): Promise<any> {
    return await axios({
        method: "get",
        url: url,
        responseType: "stream",
    }).then(function (response) {
        return response.data.pipe(fs.createWriteStream(outPath));
    })
}

router.patch("/generate", async (req: any, res: any) => {
    fs.readdirSync(`${process.env.ASSETS_PATH}/public/images`).forEach(e => fs.rmSync(`${process.env.ASSETS_PATH}/public/images/` + e));
    fs.readdirSync(`${process.env.ASSETS_PATH}/public/audios`).forEach(e => fs.rmSync(`${process.env.ASSETS_PATH}/public/audios/` + e));

    await Author.deleteMany({ _id: { $ne: null } });
    await Genre.deleteMany({ _id: { $ne: null } });
    await List.deleteMany({ _id: { $ne: null } });
    await Album.deleteMany({ _id: { $ne: null } });
    await Track.deleteMany({ _id: { $ne: null } });

    for (let n = 0; n < 6; n++) {
        const author = new Author({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            gender: faker.person.gender(),
            description: faker.lorem.sentence(),
            dob: Date(),
            dod: Date(),
        });
        const filepath = `${process.env.ASSETS_PATH}/public/images/author-${author._id.toString()}-${Date.now()}.jpg`;
        await download(faker.image.urlPicsumPhotos({ width: 300, height: 100 }), filepath);
        author.image = filepath.replace(process.env.ASSETS_PATH ?? "", "");
        await author.save();
    }


    for (let n = 0; n < 6; n++) {
        const genre = await Genre.findOne({
            name: faker.music.genre(),
        }) ?? new Genre({
            name: faker.music.genre(),
        });

        const filepath = `${process.env.ASSETS_PATH}/public/images/genre-${genre._id.toString()}-${Date.now()}.jpg`;
        await download(faker.image.urlPicsumPhotos({ width: 300, height: 100 }), filepath);
        genre.thumbnail = filepath.replace(process.env.ASSETS_PATH ?? "", "");
        await genre.save();
    }

    for (let n = 0; n < 6; n++) {
        const list = new List({
            name: faker.company.buzzAdjective(),
        });
        const filepath = `${process.env.ASSETS_PATH}/public/images/list-${list._id.toString()}-${Date.now()}.jpg`;
        await download(faker.image.urlPicsumPhotos({ width: 300, height: 100 }), filepath);
        list.thumbnail = filepath.replace(process.env.ASSETS_PATH ?? "", "");
        await list.save();
    }

    for (let n = 0; n < 6; n++) {
        const album: any = new Album({
            title: faker.company.buzzAdjective(),
            excerpt: faker.lorem.sentence(),
            description: faker.lorem.sentence(),
            language: "en",
            duration: Math.ceil(Math.random() * 100000),
            authors: await Author.aggregate([{ $sample: { size: 1 } }]),
            genres: await Genre.aggregate([{ $sample: { size: 1 } }]),
            lists: await List.aggregate([{ $sample: { size: 1 } }]),
            type: ALBUM_TYPE_ENUM.ALBUM
        });
        const filepath = `${process.env.ASSETS_PATH}/public/images/album-${album._id.toString()}-${Date.now()}.jpg`;
        await download(faker.image.urlPicsumPhotos({ width: 300, height: 100 }), filepath);
        album.thumbnail = filepath.replace(process.env.ASSETS_PATH ?? "", "");
        await album.save();
    }

    for (let n = 0; n < 100; n++) {
        const track: any = new Track({
            title: faker.company.buzzAdjective(),
            excerpt: faker.lorem.sentence(),
            description: faker.lorem.sentence(),
            language: "en",
            duration: Math.ceil(Math.random() * 100000),
            authors: await Author.aggregate([{ $sample: { size: 2 } }]),
            genres: await Genre.aggregate([{ $sample: { size: 2 } }]),
            lists: await List.aggregate([{ $sample: { size: 2 } }]),
            type: TRACK_TYPE_ENUM.SONG,
            album: (await Album.aggregate([{ $sample: { size: 1 } }]))[0]
        });
        const filepath = `${process.env.ASSETS_PATH}/public/images/track-${track._id.toString()}-${Date.now()}.jpg`;
        await download(faker.image.urlPicsumPhotos({ width: 300, height: 100 }), filepath);
        track.thumbnail = filepath.replace(process.env.ASSETS_PATH ?? "", "");

        const sourcepath = `${process.env.PROJECT_PATH}/test.mp3`;
        const audiopath = `${process.env.ASSETS_PATH}/public/audios/track-${track._id.toString()}-${Date.now()}.mp3`;
        fs.cpSync(sourcepath, audiopath);
        track.audio = audiopath.replace(process.env.ASSETS_PATH ?? "", "");
        await track.save();
    }

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        message: "Successful",
    }));
})

export default router;