/**
 * Language Store + Translations
 * Supports: English (en), French (fr), Spanish (es), Mandarin (zh)
 */
import { create } from 'zustand';

export type Language = 'en' | 'fr' | 'es' | 'zh';

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: '🇬🇧 English',
  fr: '🇫🇷 Français',
  es: '🇪🇸 Español',
  zh: '🇨🇳 中文',
};

const translations = {
  en: {
    // Tabs
    store: 'Store', library: 'Library', pen: 'Pen', profile: 'Profile',
    // Auth
    signIn: 'Sign In', signUp: 'Sign Up', createAccount: 'Create Account',
    email: 'Email', password: 'Password', firstName: 'First Name', lastName: 'Last Name',
    childName: "Child's Name", childNameOptional: "Child's Name (optional)",
    childNameHint: "Your child's name shown in the app",
    forgotPassword: 'Forgot Password?', continueWithGoogle: 'Continue with Google',
    rememberMe: 'Remember me', noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    orDivider: 'or',
    // Library
    myLibrary: 'My Library', noBooks: 'No Books Yet',
    noBooksHint: 'Browse the store and download books to add them to your library',
    removingBook: 'Remove Book',
    removeConfirm: 'Are you sure you want to remove this book from your library?',
    remove: 'Remove', cancel: 'Cancel',
    // Profile
    account: 'Account', preferences: 'Preferences', support: 'Support',
    signOut: 'Sign Out', editProfile: 'Edit Profile', changePassword: 'Change Password',
    updateInfo: 'Update your information', updatePassword: 'Update your password',
    notifications: 'Notifications', manageNotif: 'Manage notifications',
    appearance: 'Appearance', appearanceDesc: 'Light, dark, or auto',
    parentalControls: 'Parental Controls', parentalDesc: 'Manage family settings',
    helpSupport: 'Help & Support', termsPrivacy: 'Terms & Privacy', about: 'About',
    // Appearance / Settings
    language: 'Language', languageDesc: 'English, Français, Español, 中文', theme: 'Theme', textSize: 'Text Size',
    light: 'Light', dark: 'Dark', auto: 'Auto',
    lightDesc: 'Classic bright look', darkDesc: 'Easy on the eyes at night', autoDesc: 'Follows device setting',
    small: 'Small', medium: 'Medium', large: 'Large',
    saveChanges: 'Save Changes', appearanceSaved: '✓ Appearance saved!',
    preview: 'Preview',
    // Common
    download: 'Download', downloaded: 'Downloaded ✓', back: '← Back',
    atLeast6: 'At least 6 characters',
    acceptTerms: 'I accept the Terms of Service',
    acceptPrivacy: 'I accept the Privacy Policy',
    optional: 'optional',
  },
  fr: {
    store: 'Boutique', library: 'Bibliothèque', pen: 'Stylo', profile: 'Profil',
    signIn: 'Se connecter', signUp: "S'inscrire", createAccount: 'Créer un compte',
    email: 'E-mail', password: 'Mot de passe', firstName: 'Prénom', lastName: 'Nom',
    childName: "Nom de l'enfant", childNameOptional: "Nom de l'enfant (optionnel)",
    childNameHint: "Le nom de votre enfant affiché dans l'application",
    forgotPassword: 'Mot de passe oublié ?', continueWithGoogle: 'Continuer avec Google',
    rememberMe: 'Se souvenir de moi', noAccount: 'Pas encore de compte ?',
    hasAccount: 'Déjà un compte ?',
    orDivider: 'ou',
    myLibrary: 'Ma Bibliothèque', noBooks: 'Aucun livre',
    noBooksHint: 'Parcourez la boutique et téléchargez des livres pour votre bibliothèque',
    removingBook: 'Supprimer le livre',
    removeConfirm: 'Êtes-vous sûr de vouloir supprimer ce livre de votre bibliothèque ?',
    remove: 'Supprimer', cancel: 'Annuler',
    account: 'Compte', preferences: 'Préférences', support: 'Support',
    signOut: 'Se déconnecter', editProfile: 'Modifier le profil', changePassword: 'Changer le mot de passe',
    updateInfo: 'Mettre à jour vos informations', updatePassword: 'Mettre à jour le mot de passe',
    notifications: 'Notifications', manageNotif: 'Gérer les notifications',
    appearance: 'Apparence', appearanceDesc: 'Clair, sombre ou auto',
    parentalControls: 'Contrôle parental', parentalDesc: 'Paramètres famille',
    helpSupport: 'Aide et support', termsPrivacy: 'Conditions et confidentialité', about: 'À propos',
    language: 'Langue', languageDesc: "Choisir la langue de l'app", theme: 'Thème', textSize: 'Taille du texte',
    light: 'Clair', dark: 'Sombre', auto: 'Auto',
    lightDesc: 'Apparence lumineuse classique', darkDesc: 'Doux pour les yeux la nuit', autoDesc: 'Suit les paramètres',
    small: 'Petit', medium: 'Moyen', large: 'Grand',
    saveChanges: 'Enregistrer', appearanceSaved: '✓ Apparence sauvegardée !',
    preview: 'Aperçu',
    download: 'Télécharger', downloaded: 'Téléchargé ✓', back: '← Retour',
    atLeast6: 'Au moins 6 caractères',
    acceptTerms: "J'accepte les Conditions d'utilisation",
    acceptPrivacy: "J'accepte la Politique de confidentialité",
    optional: 'optionnel',
  },
  es: {
    store: 'Tienda', library: 'Biblioteca', pen: 'Pluma', profile: 'Perfil',
    signIn: 'Iniciar sesión', signUp: 'Registrarse', createAccount: 'Crear cuenta',
    email: 'Correo', password: 'Contraseña', firstName: 'Nombre', lastName: 'Apellido',
    childName: 'Nombre del niño', childNameOptional: 'Nombre del niño (opcional)',
    childNameHint: 'El nombre de tu hijo en la app',
    forgotPassword: '¿Olvidaste tu contraseña?', continueWithGoogle: 'Continuar con Google',
    rememberMe: 'Recordarme', noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?',
    orDivider: 'o',
    myLibrary: 'Mi Biblioteca', noBooks: 'Sin libros todavía',
    noBooksHint: 'Explora la tienda y descarga libros para tu biblioteca',
    removingBook: 'Eliminar libro',
    removeConfirm: '¿Estás seguro de que quieres eliminar este libro de tu biblioteca?',
    remove: 'Eliminar', cancel: 'Cancelar',
    account: 'Cuenta', preferences: 'Preferencias', support: 'Soporte',
    signOut: 'Cerrar sesión', editProfile: 'Editar perfil', changePassword: 'Cambiar contraseña',
    updateInfo: 'Actualizar información', updatePassword: 'Actualizar contraseña',
    notifications: 'Notificaciones', manageNotif: 'Gestionar notificaciones',
    appearance: 'Apariencia', appearanceDesc: 'Claro, oscuro o auto',
    parentalControls: 'Control parental', parentalDesc: 'Configuración familiar',
    helpSupport: 'Ayuda y soporte', termsPrivacy: 'Términos y privacidad', about: 'Acerca de',
    language: 'Idioma', languageDesc: 'Elige el idioma de la app', theme: 'Tema', textSize: 'Tamaño de texto',
    light: 'Claro', dark: 'Oscuro', auto: 'Auto',
    lightDesc: 'Aspecto clásico brillante', darkDesc: 'Fácil para los ojos de noche', autoDesc: 'Sigue el dispositivo',
    small: 'Pequeño', medium: 'Mediano', large: 'Grande',
    saveChanges: 'Guardar cambios', appearanceSaved: '✓ ¡Apariencia guardada!',
    preview: 'Vista previa',
    download: 'Descargar', downloaded: 'Descargado ✓', back: '← Atrás',
    atLeast6: 'Al menos 6 caracteres',
    acceptTerms: 'Acepto los Términos de servicio',
    acceptPrivacy: 'Acepto la Política de privacidad',
    optional: 'opcional',
  },
  zh: {
    store: '商店', library: '书库', pen: '画笔', profile: '我的',
    signIn: '登录', signUp: '注册', createAccount: '创建账户',
    email: '邮箱', password: '密码', firstName: '名', lastName: '姓',
    childName: '孩子姓名', childNameOptional: '孩子姓名（可选）',
    childNameHint: '显示在应用中的孩子姓名',
    forgotPassword: '忘记密码？', continueWithGoogle: '使用 Google 继续',
    rememberMe: '记住我', noAccount: '还没有账户？',
    hasAccount: '已有账户？',
    orDivider: '或',
    myLibrary: '我的书库', noBooks: '暂无书籍',
    noBooksHint: '浏览商店并下载书籍以添加到书库',
    removingBook: '删除书籍',
    removeConfirm: '确定要从书库中删除这本书吗？',
    remove: '删除', cancel: '取消',
    account: '账户', preferences: '偏好设置', support: '支持',
    signOut: '退出登录', editProfile: '编辑资料', changePassword: '修改密码',
    updateInfo: '更新您的信息', updatePassword: '更新密码',
    notifications: '通知', manageNotif: '管理通知',
    appearance: '外观', appearanceDesc: '浅色、深色或自动',
    parentalControls: '家长控制', parentalDesc: '管理家庭设置',
    helpSupport: '帮助与支持', termsPrivacy: '条款与隐私', about: '关于',
    language: '语言', languageDesc: '选择应用语言', theme: '主题', textSize: '文字大小',
    light: '浅色', dark: '深色', auto: '自动',
    lightDesc: '经典明亮外观', darkDesc: '夜间护眼模式', autoDesc: '跟随设备设置',
    small: '小', medium: '中', large: '大',
    saveChanges: '保存更改', appearanceSaved: '✓ 外观已保存！',
    preview: '预览',
    download: '下载', downloaded: '已下载 ✓', back: '← 返回',
    atLeast6: '至少6个字符',
    acceptTerms: '我接受服务条款',
    acceptPrivacy: '我接受隐私政策',
    optional: '可选',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
}));

/** Get the translations object for a given language */
export const getTranslations = (language: Language) => translations[language] ?? translations.en;

export default useLanguageStore;
