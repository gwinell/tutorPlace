import { redirect } from "next/navigation";

export const metadata = {
  title: "Возврат средств — публичная оферта — codeTogether",
};

export default function RefundPage(): never {
  redirect("/offer#refund");
}
