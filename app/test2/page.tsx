"use client";
import { Code } from "@/components/code";
import { PhoneInput, getPhoneData } from "@/components/phone-input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React from "react";
import InfiniteScroll from "@/components/infinite-scroll";
import { Loader2 } from "lucide-react";

interface DummyProductResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

interface DummyProduct {
  id: number;
  title: string;
  price: string;
}

const Product = ({ product }: { product: DummyProduct }) => {
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border-2 border-gray-200 p-2">
      <div className="flex gap-2">
        <div className="flex flex-col justify-center gap-1">
          <div className="font-bold text-primary">
            {product.id} - {product.title}
          </div>
          <div className="text-sm text-muted-foreground">{product.price}</div>
        </div>
      </div>
    </div>
  );
};

export default function PhoneInputDefault() {
  const [phone, setPhone] = React.useState("+1 (408) 996–1010");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const phoneData = getPhoneData(phone);

  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [products, setProducts] = React.useState<DummyProduct[]>([]);

  const next = async () => {
    setLoading(true);

    /**
     * Intentionally delay the search by 800ms before execution so that you can see the loading spinner.
     * In your app, you can remove this setTimeout.
     **/
    setTimeout(async () => {
      const res = await fetch(
        `https://dummyjson.com/products?limit=3&skip=${
          3 * page
        }&select=title,price`
      );
      const data = (await res.json()) as DummyProductResponse;
      setProducts((prev) => [...prev, ...data.products]);
      setPage((prev) => prev + 1);

      // Usually your response will tell you if there is no more data.
      if (data.products.length < 3) {
        setHasMore(false);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-4">
        <PhoneInput value={phone} onChange={handleOnChange} />
      </div>
      <p className="text-muted-foreground">
        We can use the <Code>getPhoneData</Code> utility function to get a lot
        of information about the selected number.
      </p>
      <div className="flex flex-col gap-2 border rounded-lg p-3 text-sm">
        <div className="flex gap-2">
          <p>Phone number: </p>
          <span className="font-semibold">{phoneData.phoneNumber || "-"}</span>
        </div>
        <Separator />
        <div className="flex gap-2">
          <p>Country code: </p>
          <span className="font-semibold">{phoneData.countryCode || "-"}</span>
        </div>
        <Separator />
        <div className="flex gap-2">
          <p>Country calling code: </p>
          <span className="font-semibold">
            {phoneData.countryCallingCode || "-"}
          </span>
        </div>
        <Separator />
        <div className="flex gap-2">
          <p>National number: </p>
          <span className="font-semibold">
            {phoneData.nationalNumber || "-"}
          </span>
        </div>
        <Separator />
        <div className="flex gap-2">
          <p>International number: </p>
          <span className="font-semibold">
            {phoneData.internationalNumber || "-"}
          </span>
        </div>
        <Separator />
        <div className="flex gap-2">
          <p>URI: </p>
          <span className="font-semibold">{phoneData.uri || "-"}</span>
        </div>
        <Separator />
        <div className="flex gap-2">
          <p className="flex-shrink-0">Possible countries: </p>
          <span className="font-semibold">
            {phoneData.possibleCountries || "-"}
          </span>
        </div>
        <Separator />
        <Badge
          className={cn(
            "w-fit",
            phoneData.isValid
              ? "bg-green-500 text-green-50"
              : "bg-destructive text-destructive-foreground"
          )}
        >
          VALID NUMBER
        </Badge>
        <Separator />
        <Badge
          className={cn(
            "w-fit",
            phoneData.isPossible
              ? "bg-green-500 text-green-50"
              : "bg-destructive text-destructive-foreground"
          )}
        >
          POSSIBLE NUMBER
        </Badge>
      </div>

      <div className="max-h-[300px] w-full  overflow-y-auto px-10">
        <div className="flex w-full flex-col items-center  gap-3">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
          <InfiniteScroll
            hasMore={hasMore}
            isLoading={loading}
            next={next}
            threshold={1}
          >
            {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}
