import Image from "next/image";
import localFont from "next/font/local";
import { useState } from "react";
import axios from "axios";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [selectedId, setSelectedId] = useState("");
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState("");

  const handleIdSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setProductData(null);

    try {
      const response = await axios.get(`/api/simaland?itemId=${selectedId}`);
      setProductData(response.data);
    } catch (err) {
      setError("Failed to fetch product data. Please try again.");
      console.error(err);
    }
  };

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <form onSubmit={handleIdSubmit} className="flex flex-col gap-4 w-full max-w-xs">
          <input
            type="text"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            placeholder="Enter product ID"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Fetch Product Data
          </button>
        </form>

        {error && <p className="text-red-500">{error}</p>}

        {productData && (
          <div className="mt-4 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">{productData.name}</h2>
            <img
              src={productData.photoUrl}
              alt={productData.image_alt}
              className="mb-4 rounded-lg shadow-md"
            />
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Price:</strong> {productData.price} {productData.currencySign}
              </p>
              <p>
                <strong>SKU:</strong> {productData.sid}
              </p>
              <p>
                <strong>Country:</strong> {productData.country.name}
              </p>
              <p>
                <strong>Size:</strong> {productData.size}
              </p>
              <p>
                <strong>Material:</strong> {productData.stuff}
              </p>
              <p>
                <strong>Minimum Order:</strong> {productData.minimum_order_quantity}
              </p>
              <p>
                <strong>In Box:</strong> {productData.in_box} {productData.inBoxPluralNameFormat}
              </p>
              <p>
                <strong>Weight:</strong> {productData.weight} g
              </p>
              <p>
                <strong>Updated At:</strong> {new Date(productData.updated_at).toLocaleString()}
              </p>
              <p>
                <strong>Free Delivery:</strong> {productData.is_free_delivery ? "Yes" : "No"}
              </p>
            </div>
            {productData.is_free_delivery && (
              <p className="mt-4">
                <em>
                  Free delivery for orders over {productData.min_sum_for_free_delivery}{" "}
                  {productData.currencySign}
                </em>
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
