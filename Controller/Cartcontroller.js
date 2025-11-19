import Cart from "../Models/Cartmodels.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId } = req.body;
    if (!bookId) return res.status(400).json({ message: "bookId required" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [{ book: bookId, quantity: 1 }] });
    } else {
      const idx = cart.items.findIndex(i => i.book.toString() === bookId);
      if (idx >= 0) cart.items[idx].quantity += 1;
      else cart.items.push({ book: bookId, quantity: 1 });
    }

    await cart.save();
    return res.json({ message: "Added to cart", cart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
