import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types';

interface CreateAdminModalProps {
  onCreateAdmin: (userData: Partial<User> & { password: string }) => Promise<User>;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({
  onCreateAdmin,
  onSuccess,
  trigger,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (password !== confirmPassword) {
      setCreateError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setCreateError('Password must be at least 6 characters long');
      return;
    }

    setIsCreating(true);

    try {
      await onCreateAdmin({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      setEmail('');
      setFirstName('');
      setLastName('');
      setPassword('');
      setConfirmPassword('');
      setIsDialogOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create admin';
      setCreateError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEmail('');
    setFirstName('');
    setLastName('');
    setPassword('');
    setConfirmPassword('');
    setCreateError(null);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="primaryGreen" size="pill">
            Add Admin
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Admin</DialogTitle>
          <DialogDescription>
            Enter the details for the new admin user.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateAdmin}>
          <div className="grid gap-4 py-4">
            {createError && (
              <div className="bg-red-50 border-l-4 border-error text-error px-4 py-3 rounded-md text-sm">
                {createError}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={isCreating}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                disabled={isCreating}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                disabled={isCreating}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={isCreating}
                minLength={6}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                disabled={isCreating}
                minLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="pill"
              onClick={handleCancel}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primaryGreen"
              size="pill"
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Admin'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdminModal;

