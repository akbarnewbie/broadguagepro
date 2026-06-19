import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { wixLogin, wixRegister, sendReset, isLoggedIn } from "@/integrations/wix/auth";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import loginBg from "@/assets/login.png";
import logo from "@/assets/BGP_Logo.png";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  // Forgot password state
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => {
    if (isLoggedIn()) navigate("/", { replace: true });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await wixLogin(loginEmail, loginPassword);
    setLoading(false);
    if (result.ok) {
      toast({ title: "Welcome back! 🎉" });
      navigate("/", { replace: true });
    } else {
      toast({ title: "Login failed", description: result.error, variant: "destructive" });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupConfirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (signupPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const result = await wixRegister(signupEmail, signupPassword, signupName);
    setLoading(false);
    if (result.ok) {
      toast({ title: "Account created! 🎉" });
      navigate("/", { replace: true });
    } else {
      toast({ title: "Sign up", description: result.error, variant: "destructive" });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await sendReset(forgotEmail);
    setLoading(false);
    if (result.ok) {
      toast({ title: "Check your email", description: "We sent you a password reset link." });
      setForgotMode(false);
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background */}
      <img src={loginBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="BGPro" className="h-14 w-14 rounded-full mb-3" />
          <h1 className="text-xl font-bold text-foreground">Welcome to BGPro</h1>
          <p className="text-sm text-muted-foreground">Broad Gauge Productions</p>
        </div>

        {forgotMode ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Reset Password</h2>
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input id="forgot-email" type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2" size={16} />}
              Send Reset Link
            </Button>
            <button type="button" onClick={() => setForgotMode(false)} className="text-sm text-primary hover:underline w-full text-center">
              Back to login
            </button>
          </form>
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="login" className="flex-1">Log In</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="animate-spin mr-2" size={16} />}
                  Log In
                </Button>
                <button type="button" onClick={() => setForgotMode(true)} className="text-sm text-primary hover:underline w-full text-center">
                  Forgot password?
                </button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Display Name</Label>
                  <Input id="signup-name" type="text" required value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" required value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" required value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input id="signup-confirm" type="password" required value={signupConfirm} onChange={(e) => setSignupConfirm(e.target.value)} placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="animate-spin mr-2" size={16} />}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Auth;
