import mongoose, { Schema, Document, Model, mongo } from "mongoose";
import slugify from "slugify";

export interface IAuthor {
  firstName: string,
  lastName: string,
  image: string,
  imageUrl?: string,
  slug: string,
  gender: string,
  description: string,
  dob: Date,
  dod: Date,
}

export interface IAuthorAuthor extends IAuthor, Document {
}

const AuthorSchema: Schema<IAuthorAuthor> = new Schema<IAuthorAuthor>(
  {
    firstName: String,
    lastName: String,
    image: String,
    imageUrl: String,
    slug: { type: String, unique: true },
    dob: Date,
    gender: String,
    description: String,
    dod: Date,
  },
  {
    timestamps: true,
    methods: {

    }
  }
);

AuthorSchema.pre("save", async function () {
  if (!this.slug) {
    let slug: string = slugify(this.firstName + " " + this.lastName, { remove: /[*+~.()'"!:@]/g, lower: true });
    const count = await Author.countDocuments({ slug: new RegExp(slug, "i") });
    if (count > 0) slug = slug + "-" + count;
    this.slug = slug.toLowerCase();
  }
  this.imageUrl = `${process.env.PUBLIC_URL}${this.image}`
})


export const Author: Model<IAuthorAuthor> = mongoose.model<IAuthorAuthor>("Author", AuthorSchema);