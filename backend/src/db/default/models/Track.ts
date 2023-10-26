import mongoose, { Schema, Document, Model } from "mongoose";
import conn from "../conn";
import { Album, IAlbum } from "./Album";
import slugify from "slugify";
import { List } from "./List";
import { Author } from "./Author";
import { Genre } from "./Genre";
import { TRACK_TYPE_ENUM } from "../../../enums/album";

export interface ITrack {
  title: string,
  excerpt: string,
  description: string,
  slug: string,
  language: string,
  thumbnail: string,
  audio: string,
  duration: string,
  authors: mongoose.ObjectId[],
  genres: mongoose.ObjectId[],
  lists: mongoose.ObjectId[],
  album: mongoose.ObjectId | IAlbum,
  position: number,
  type: "EPISODE" | "CHAPTER" | "SONG"
}

export interface ITrackModel extends ITrack, Document {
  generateUrls(): ITrackModel
}

const TrackSchema: Schema<ITrackModel> = new Schema<ITrackModel>(
  {
    title: String,
    excerpt: String,
    description: String,
    slug: { type: String, unique: true },
    language: String,
    thumbnail: String,
    audio: String,
    duration: Number,
    authors: { type: [mongoose.Types.ObjectId], ref: Author },
    genres: { type: [mongoose.Types.ObjectId], ref: Genre },
    lists: { type: [mongoose.Types.ObjectId], ref: List },
    album: {
      type: mongoose.Types.ObjectId,
      ref: Album
    },
    position: Number,
    type: { type: String, enum: Object.values(TRACK_TYPE_ENUM) }
  },
  {
    timestamps: true,
    // You can define any custom methods or other configurations here if needed
    methods: {
      generateUrls: function () {
        this.thumbnail = this.thumbnail ? process.env.PUBLIC_URL + this.thumbnail : "";
        this.audio = this.audio ? process.env.PUBLIC_URL + this.audio : "";
        return this;
      }
    },
  }
);

TrackSchema.pre("save", async function () {
  if (!this.slug) {
    let slug: string = slugify(this.title);
    const count = await Track.countDocuments({ slug: new RegExp(slug, "i") });
    if (count > 0) slug = slug + "-" + count;
    this.slug = slug.toLowerCase();
  }
})

export const Track: Model<ITrackModel> = conn.model<ITrackModel>("Track", TrackSchema);