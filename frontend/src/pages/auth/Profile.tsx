import { useAuth } from '@/api/hooks/useAuth';
import { BackButton } from '@/components/common/BackButton';
import { LoadingState } from '@/components/common/LoadingState';
import { Layout } from '@/components/layout/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <Layout>
        <LoadingState
          message="Cargando perfil..."
          minHeight="min-h-[400px]"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <BackButton
          to="/"
          text="Volver al inicio"
        />
        <h1 className="text-4xl font-bold mb-2 leading-relaxed">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={(user as any)?.profile_image}
                    alt={user.username}
                  />
                  <AvatarFallback className="text-2xl">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold">{user.username}</h2>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </Badge>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nombre de usuario</Label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md mt-1">{user.username}</p>
            </div>

            <div>
              <Label>Email</Label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md mt-1">{user.email}</p>
            </div>

            <div>
              <Label>Rol</Label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md mt-1 capitalize">
                {user.role}
              </p>
            </div>

            <div className="pt-4 border-t">
              <Button
                onClick={logout}
                variant="destructive"
                className="w-full"
              >
                Cerrar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
