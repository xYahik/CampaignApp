import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Link, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/ui/AuthProvider";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const result = await handleRegister(data);

    if (result) {
      toast.success("The user was created");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Enter your details below to create account
            <br />
            (Now automatically creates emerald account with added funds for
            tests purpose)
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-3">
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full"
                >
                  {isSubmitting ? "Loading..." : "Create"}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                Already have an user?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>

              {errors.root && (
                <div className="mt-2 text-sm text-red-500">
                  {errors.root.message}
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
