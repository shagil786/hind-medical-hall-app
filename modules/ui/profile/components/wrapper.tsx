"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, KeyRound, Languages, LogOut, Share2, User2, HeadphonesIcon, X, Check, UserCircle2 } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '@/provider/authProvider'; // You'll need to create this hook
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

// At the top of your file, add this interface
interface ChatMessage {
  sender: 'user' | 'representative';
  text: string;
}

export default function PharmacyProfile() {
  const { user , login, handleShow } = useAuth(); // Assume this hook provides user info and login function
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@pharmacy.com',
    phone: '+1 555-123-4567',
    address: '123 Medical Center Drive'
  });
  const [editedInfo, setEditedInfo] = useState({ ...personalInfo });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [showCustomerSupport, setShowCustomerSupport] = useState(false);
  const [showSecurityOptions, setShowSecurityOptions] = useState(false);
  const [showPersonalInfoEdit, setShowPersonalInfoEdit] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]); // Updated state declaration
  const [newMessage, setNewMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [memberIdCopied, setMemberIdCopied] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('/api/placeholder/100/100');

  // Mock data for orders
  const orders = [
    { id: 1, date: '2023-05-01', total: 150, status: 'Delivered' },
    { id: 2, date: '2023-04-15', total: 200, status: 'Processing' },
    // ... more orders ...
  ];

  const handleEdit = () => {
    if (isEditing) {
      setPersonalInfo({ ...editedInfo });
    } else {
      setEditedInfo({ ...personalInfo });
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditedInfo({ ...personalInfo });
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
    setShowLogoutConfirm(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Pharmacy App',
      text: 'Check out this great pharmacy app!',
      url: 'https://yourpharmacyapp.com', // Replace with your actual website URL
    };

    if (Capacitor.isNativePlatform()) {
      // We're in a Capacitor app
      try {
        await Share.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
          dialogTitle: 'Share with buddies',
        });
      } catch (error) {
        console.error('Error sharing via Capacitor:', error);
      }
    } else if (typeof navigator !== 'undefined' && navigator.share) {
      // Web Share API is supported
      try {
        await navigator.share(shareData);
        console.log('Successful share');
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for unsupported platforms
      console.log('Sharing not supported on this platform');
      // Implement a fallback sharing method here, such as copying to clipboard
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
          console.log('Text copied to clipboard');
          // You might want to show a toast or some feedback to the user here
        } catch (err) {
          console.error('Failed to copy text: ', err);
        }
      }
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  const handleLanguageSave = () => {
    // Implement language change logic here
    console.log(`Changing language to ${selectedLanguage}`);
    setShowLanguageSelect(false);
  };

  const handleResetPassword = () => {
    // Implement reset password logic here
    console.log("Sending password reset email...");
  };

  const handlePersonalInfoSave = () => {
    setPersonalInfo({ ...editedInfo });
    setShowPersonalInfoEdit(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, { sender: 'user', text: newMessage }]);
      setNewMessage('');
      // Simulate customer representative response
      setTimeout(() => {
        setChatMessages((prev) => [...prev, { sender: 'representative', text: 'Thank you for your message. How can I assist you today?' }]);
      }, 1000);
    }
  };

  const copyMemberId = () => {
    const memberId = 'PH19202033724'; // Replace with actual member ID if it's dynamic

    const copyToClipboard = (text: string) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      } else {
        return new Promise<void>((resolve, reject) => {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (successful) {
              resolve();
            } else {
              reject();
            }
          } catch (err) {
            document.body.removeChild(textArea);
            reject(err);
          }
        });
      }
    };

    copyToClipboard(memberId)
      .then(() => {
        setMemberIdCopied(true);
        setTimeout(() => setMemberIdCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        // Optionally, show an error message to the user
      });
  };

  const indianLanguages = [
    "Hindi", "Bengali", "Telugu", "Marathi", "Tamil",
    "Urdu", "Gujarati", "Kannada", "Odia", "Malayalam"
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = () => {
    // Implement login logic here
    handleShow();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 font-sans h-full bg-gray-50">
      <motion.div 
        layout 
        className="flex flex-col items-center justify-center space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
      >
        {user ? (
          <>
            <Avatar className="h-24 w-24 border-4 border-green-500">
              <AvatarImage src={avatarUrl} alt="Profile" />
              <AvatarFallback className="bg-green-500 text-white text-2xl font-bold">
                {user?.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-4">
              <UserCircle2 className="h-16 w-16 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Guest User</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Sign in to access your profile</p>
              <Button 
                onClick={handleLogin} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Login
              </Button>
            </div>
          </>
        )}
      </motion.div>

      <ScrollArea className="h-full">
        <motion.div layout className="space-y-2">
          {user ? (
            <>
              <ProfileSection 
                icon={<User2 />} 
                title="Personal information" 
                onClick={() => setShowPersonalInfoEdit(true)}
              />
              <ProfileSection 
                icon={<KeyRound />} 
                title="Login and security" 
                onClick={() => setShowSecurityOptions(true)}
              />
              <ProfileSection 
                icon={<HeadphonesIcon />} 
                title="Customer Support" 
                onClick={() => setShowCustomerSupport(true)}
              />
              <ProfileSection 
                icon={<Languages />} 
                title="Language" 
                onClick={() => setShowLanguageSelect(true)}
              />
            </>
          ) : (
            <>
              <DisabledProfileSection icon={<User2 />} title="Personal information" />
              <DisabledProfileSection icon={<KeyRound />} title="Login and security" />
              <DisabledProfileSection icon={<HeadphonesIcon />} title="Customer Support" />
              <DisabledProfileSection icon={<Languages />} title="Language" />
            </>
          )}
          
          <Button variant="ghost" className="w-full justify-between px-0" onClick={handleShare}>
            <div className="flex items-center">
              <Share2 className="mr-2 h-5 w-5" />
              Share the app
            </div>
            <ChevronRight className="h-5 w-5" />
          </Button>
          
          {user && (
            <Button 
              variant="ghost" 
              className="w-full justify-between text-red-500 px-0"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <div className="flex items-center">
                <LogOut className="mr-2 h-5 w-5" />
                Log Out
              </div>
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </motion.div>

        {user && (
          <motion.div layout className="mt-8 text-center text-sm text-gray-500">
            <p>Member ID</p>
            <div className="flex justify-center items-center space-x-2">
              <span>PH19202033724</span>
              <Button variant="ghost" size="sm" onClick={copyMemberId}>
                {memberIdCopied ? <Check className="h-4 w-4" /> : 'Copy'}
              </Button>
            </div>
            <p className="mt-4">Version - 03</p>
          </motion.div>
        )}
      </ScrollArea>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="w-11/12 max-w-md rounded-lg bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>No</Button>
              <Button onClick={handleLogout}>Yes</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Language Selection Dialog */}
      <Dialog open={showLanguageSelect} onOpenChange={setShowLanguageSelect}>
        <DialogContent className="w-11/12 max-w-md rounded-lg bg-white">
          <DialogHeader>
            <DialogTitle>Select Language</DialogTitle>
          </DialogHeader>
          <Select onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {indianLanguages.map((lang) => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={handleLanguageSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Support Dialog */}
      <Dialog open={showCustomerSupport} onOpenChange={setShowCustomerSupport}>
        <DialogContent className="w-11/12 max-w-4xl rounded-lg bg-gray-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-600">Customer Support</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-700">Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Phone: +1 (800) 123-4567</p>
                <p className="text-gray-600">Email: support@pharmacy.com</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-700">FAQs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-gray-600">
                  <li>How do I refill my prescription?</li>
                  <li>What are your store hours?</li>
                  <li>Do you offer delivery services?</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Security Options Dialog */}
      <Dialog open={showSecurityOptions} onOpenChange={setShowSecurityOptions}>
        <DialogContent className="w-11/12 max-w-md rounded-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-600">Security Options</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-700">Two-Factor Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <Switch />
                <span className="ml-2 text-sm text-gray-600">Enable 2FA for enhanced security</span>
              </CardContent>
            </Card>
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-700">Password Reset</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Change Password</Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Personal Info Edit Dialog */}
      <Dialog open={showPersonalInfoEdit} onOpenChange={setShowPersonalInfoEdit}>
        <DialogContent className="w-11/12 max-w-md rounded-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-600">Edit Personal Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl} alt="Profile" />
                <AvatarFallback>{personalInfo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar-upload" className="cursor-pointer text-blue-500">
                  Change Avatar
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            <Input
              value={editedInfo.name}
              onChange={(e) => setEditedInfo({ ...editedInfo, name: e.target.value })}
              placeholder="Name"
            />
            <Input
              value={editedInfo.email}
              onChange={(e) => setEditedInfo({ ...editedInfo, email: e.target.value })}
              placeholder="Email"
            />
            <Input
              value={editedInfo.phone}
              onChange={(e) => setEditedInfo({ ...editedInfo, phone: e.target.value })}
              placeholder="Phone"
            />
            <Input
              value={editedInfo.address}
              onChange={(e) => setEditedInfo({ ...editedInfo, address: e.target.value })}
              placeholder="Address"
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={() => setShowPersonalInfoEdit(false)}>Cancel</Button>
              <Button onClick={handlePersonalInfoSave}>Save Changes</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProfileSection({ icon, title, onClick }: { icon: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <Button variant="ghost" className="w-full justify-between px-0" onClick={onClick}>
      <div className="flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </div>
      <ChevronRight className="h-5 w-5" />
    </Button>
  );
}

function DisabledProfileSection({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="w-full flex justify-between items-center px-4 py-2 text-gray-400">
      <div className="flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </div>
      <ChevronRight className="h-5 w-5" />
    </div>
  );
}

function OrderCard({ order, onClick }: { order: any; onClick: () => void }) {
  return (
    <Card className="mb-4 cursor-pointer" onClick={onClick}>
      <CardHeader>
        <CardTitle>Order #{order.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Date: {order.date}</p>
        <p>Total: ${order.total}</p>
        <p>Status: {order.status}</p>
      </CardContent>
    </Card>
  );
}