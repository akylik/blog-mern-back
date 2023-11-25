import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error creating post",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts.map((post) => post.tags).flat().slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Failed to retrieve tags",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec(); // звязуємо Post з user по його id
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Failed to retrieve articles",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },  // збільшуємо число переглядів статті
      },
      {
        new: true, // Возвращать обновленный документ
      }
    )
      .populate("user") // звязуємо Post з user по його id
      .exec((error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            msg: "Failed to return article",
          });
        }

        if (!doc) {
          return res.status(404).json({
            msg: "Article not found",
          });
        }

        res.json(doc);
      });
    // PostModel.findOneAndUpdate(
    //   {
    //     _id: postId,
    //   },
    //   {
    //     $inc: { viewsCount: 1 }, // збільшуємо число переглядів статті
    //   },
    //   {
    //     returnDocument: "after", // повертаємо документ оновлений
    //   },
    //   (error, doc) => {  // передаємо функцію, яка буде виконуватися
    //     if (error) {
    //       console.log(error);
    //       return res.status(500).json({
    //         msg: "Failed to return article",
    //       });
    //     }

    //     if (!doc) {
    //       return res.status(404).json({
    //         msg: "Article not found",
    //       });
    //     }

    //     res.json(doc);
    //   }
    // );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Failed to retrieve articles",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            msg: "Failed to delete article",
          });
        }

        if (!doc) {
          return res.status(404).json({
            msg: "Article not found",
          });
        }

        res.json({
          success: true,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Failed to delete article",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Failed to update article",
    });
  }
};
