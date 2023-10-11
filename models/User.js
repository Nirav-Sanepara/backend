const { model, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    // basic information
    firstName: {
      type: String,
    //   required: true,
    },
    lastName: {
      type: String,
    //   required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // minLength: 6,
    },
    isActive: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = model("User", userSchema);