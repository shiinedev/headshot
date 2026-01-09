"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResendVerificationEmail } from "@/lib/hooks"
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";



 
const resendVerificationSchema = z.object({
    email: z.string().email({ error: "Invalid email address" }).trim(),
});

type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;


const ResendVerificationPage = () => {

    const form = useForm<ResendVerificationInput>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
        email: "",
    },
  });

  const router = useRouter();

    const {mutate,isPending} = useResendVerificationEmail();

    const onSubmit = (data:ResendVerificationInput) => {
        mutate(data.email,{
            onSuccess:() => {
               toast.success("Verification email resent successfully.",{
                description:" Please check your inbox. If you don't see it in your inbox, please check your spam folder."
               });

               form.reset()
                router.push("/auth/login");
            },
            onError:(error) => {
                toast.error("Failed to resend verification email.",{
                    description: error.message || "failed to resend verification email.please try again later.",
                });
            }
        });
    }



  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-8 shadow-lg border border-border">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Mail className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Resend Verification Email
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email address and we'll send you a new verification link.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Verification Email"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  )
}

export default ResendVerificationPage
