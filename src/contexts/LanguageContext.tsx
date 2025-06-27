import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation keys and values
const translations = {
  en: {
    // Navigation
    'nav.browse_books': 'Browse Books',
    'nav.my_books': 'My Books',
    'nav.admin_panel': 'Admin Panel',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Logout',

    // Home page
    'home.hero.title': 'Your Digital Library Awaits',
    'home.hero.subtitle': 'Discover, borrow, and enjoy thousands of books with our modern library system. Pay only for what you read, when you read it.',
    'home.hero.browse_books': 'Browse Books',
    'home.hero.join_today': 'Join Today',
    'home.features.title': 'Why Choose BookVault?',
    'home.features.vast_collection.title': 'Vast Collection',
    'home.features.vast_collection.desc': 'Access thousands of books across multiple genres and genres',
    'home.features.flexible_rental.title': 'Flexible Rental',
    'home.features.flexible_rental.desc': 'Borrow books for as long as you need with affordable daily rates',
    'home.features.community_driven.title': 'Community Driven',
    'home.features.community_driven.desc': 'Join a community of book lovers and discover new favorites',
    'home.features.premium_service.title': 'Premium Service',
    'home.features.premium_service.desc': 'Enjoy a seamless reading experience with our digital library',
    'home.stats.books_available': 'Books Available',
    'home.stats.happy_readers': 'Happy Readers',
    'home.stats.starting_rate': 'Starting Daily Rate',
    'home.cta.title': 'Ready to Start Reading?',
    'home.cta.subtitle': 'Join thousands of readers who have discovered their next favorite book with us.',
    'home.cta.create_account': 'Create Your Account',

    // Authentication
    'auth.login.title': 'Welcome Back',
    'auth.login.subtitle': 'Sign in to your BookVault account',
    'auth.login.email': 'Email Address',
    'auth.login.password': 'Password',
    'auth.login.signin': 'Sign In',
    'auth.login.signing_in': 'Signing In...',
    'auth.login.no_account': "Don't have an account?",
    'auth.login.signup_here': 'Sign up here',
    'auth.register.title': 'Join BookVault',
    'auth.register.subtitle': 'Create your account to start reading',
    'auth.register.full_name': 'Full Name',
    'auth.register.email': 'Email Address',
    'auth.register.password': 'Password',
    'auth.register.confirm_password': 'Confirm Password',
    'auth.register.account_type': 'Account Type',
    'auth.register.user_desc': 'Browse and borrow books',
    'auth.register.admin_desc': 'Manage library system',
    'auth.register.create_account': 'Create Account',
    'auth.register.creating_account': 'Creating Account...',
    'auth.register.have_account': 'Already have an account?',
    'auth.register.signin_here': 'Sign in here',
    'auth.errors.passwords_no_match': 'Passwords do not match',
    'auth.errors.password_too_short': 'Password must be at least 6 characters long',

    // Books
    'books.title': 'Browse Our Collection',
    'books.subtitle': 'Discover your next favorite book from our extensive library',
    'books.search_placeholder': 'Search books by title or author...',
    'books.all_genres': 'All',
    'books.available': 'available',
    'books.per_day': '/day',
    'books.previous': 'Previous',
    'books.next': 'Next',

    // Book Details
    'book.back_to_books': 'Back to Books',
    'book.available_copies': 'Available',
    'book.daily_rate': 'Daily Rate',
    'book.description': 'Description',
    'book.isbn': 'ISBN',
    'book.added_by': 'Added by',
    'book.borrow_title': 'Borrow This Book',
    'book.borrowing_period': 'Borrowing Period (days)',
    'book.total_cost': 'Total Cost',
    'book.borrow_book': 'Borrow Book',
    'book.login_to_borrow': 'Login to Borrow',
    'book.processing': 'Processing...',
    'book.unavailable': 'Currently Unavailable',
    'book.unavailable_desc': 'All copies of this book are currently borrowed.',
    'book.success_message': 'Book borrowed successfully!',
    'book.not_found': 'Book Not Found',

    // Dashboard
    'dashboard.title': 'My Dashboard',
    'dashboard.welcome': 'Welcome back, {{name}}!',
    'dashboard.active_borrowings': 'Active Borrowings',
    'dashboard.completed': 'Completed',
    'dashboard.total_books': 'Total Books',
    'dashboard.total_fees': 'Total Fees',
    'dashboard.currently_borrowed': 'Currently Borrowed Books',
    'dashboard.borrowed': 'Borrowed',
    'dashboard.due': 'Due',
    'dashboard.current_fee': 'Current Fee',
    'dashboard.late_fee': '+{{amount}} late',
    'dashboard.return_book': 'Return Book',
    'dashboard.returning': 'Returning...',
    'dashboard.borrowing_history': 'Borrowing History',
    'dashboard.no_books_title': 'No Books Borrowed Yet',
    'dashboard.no_books_desc': 'Start exploring our collection to find your next great read!',
    'dashboard.browse_books': 'Browse Books',
    'dashboard.returned': 'Returned',
    'dashboard.status': 'Status',
    'dashboard.fee': 'Fee',

    // Admin Panel
    'admin.title': 'Admin Panel',
    'admin.subtitle': 'Manage your library system',
    'admin.books': 'Books',
    'admin.users': 'Users',
    'admin.borrowings': 'Borrowings',
    'admin.books_management': 'Books Management',
    'admin.add_book': 'Add Book',
    'admin.add_new_book': 'Add New Book',
    'admin.title_field': 'Title',
    'admin.author_field': 'Author',
    'admin.isbn_field': 'ISBN',
    'admin.total_copies': 'Total Copies',
    'admin.daily_fee': 'Daily Fee',
    'admin.published_year': 'Published Year',
    'admin.cover_image_url': 'Cover Image URL',
    'admin.description_field': 'Description',
    'admin.cancel': 'Cancel',
    'admin.genre': 'genre',
    'admin.copies': 'Copies',
    'admin.actions': 'Actions',
    'admin.users_management': 'Users Management',
    'admin.user': 'User',
    'admin.role': 'Role',
    'admin.member_since': 'Member Since',
    'admin.borrowings_management': 'Borrowings Management',
    'admin.book': 'Book',

    // Common
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.confirm_delete': 'Are you sure you want to delete this item?',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.close': 'Close',
    'common.submit': 'Submit',
    'common.language': 'Language',

    // genres
    'genre.fiction': 'Fiction',
    'genre.non_fiction': 'Non-Fiction',
    'genre.science': 'Science',
    'genre.technology': 'Technology',
    'genre.history': 'History',
    'genre.biography': 'Biography',
    'genre.mystery': 'Mystery',
    'genre.romance': 'Romance',
    'genre.fantasy': 'Fantasy',
    'genre.self_help': 'Self-Help',
    'genre.memoir': 'Memoir',

    // Status
    'status.borrowed': 'Borrowed',
    'status.returned': 'Returned',
    'status.overdue': 'Overdue',
    'status.active': 'Active',
    'status.inactive': 'Inactive',

    // Roles
    'role.admin': 'Admin',
    'role.user': 'User',
  },
  fr: {
    // Navigation
    'nav.browse_books': 'Parcourir les Livres',
    'nav.my_books': 'Mes Livres',
    'nav.admin_panel': 'Panneau Admin',
    'nav.login': 'Connexion',
    'nav.signup': 'S\'inscrire',
    'nav.logout': 'Déconnexion',

    // Home page
    'home.hero.title': 'Votre Bibliothèque Numérique Vous Attend',
    'home.hero.subtitle': 'Découvrez, empruntez et profitez de milliers de livres avec notre système de bibliothèque moderne. Payez seulement pour ce que vous lisez, quand vous le lisez.',
    'home.hero.browse_books': 'Parcourir les Livres',
    'home.hero.join_today': 'Rejoignez-nous Aujourd\'hui',
    'home.features.title': 'Pourquoi Choisir BookVault ?',
    'home.features.vast_collection.title': 'Vaste Collection',
    'home.features.vast_collection.desc': 'Accédez à des milliers de livres dans plusieurs genres et catégories',
    'home.features.flexible_rental.title': 'Location Flexible',
    'home.features.flexible_rental.desc': 'Empruntez des livres aussi longtemps que nécessaire avec des tarifs journaliers abordables',
    'home.features.community_driven.title': 'Communauté Active',
    'home.features.community_driven.desc': 'Rejoignez une communauté d\'amoureux des livres et découvrez de nouveaux favoris',
    'home.features.premium_service.title': 'Service Premium',
    'home.features.premium_service.desc': 'Profitez d\'une expérience de lecture fluide avec notre bibliothèque numérique',
    'home.stats.books_available': 'Livres Disponibles',
    'home.stats.happy_readers': 'Lecteurs Satisfaits',
    'home.stats.starting_rate': 'Tarif Journalier de Base',
    'home.cta.title': 'Prêt à Commencer à Lire ?',
    'home.cta.subtitle': 'Rejoignez des milliers de lecteurs qui ont découvert leur prochain livre favori avec nous.',
    'home.cta.create_account': 'Créer Votre Compte',

    // Authentication
    'auth.login.title': 'Bon Retour',
    'auth.login.subtitle': 'Connectez-vous à votre compte BookVault',
    'auth.login.email': 'Adresse Email',
    'auth.login.password': 'Mot de Passe',
    'auth.login.signin': 'Se Connecter',
    'auth.login.signing_in': 'Connexion en cours...',
    'auth.login.no_account': 'Vous n\'avez pas de compte ?',
    'auth.login.signup_here': 'Inscrivez-vous ici',
    'auth.register.title': 'Rejoindre BookVault',
    'auth.register.subtitle': 'Créez votre compte pour commencer à lire',
    'auth.register.full_name': 'Nom Complet',
    'auth.register.email': 'Adresse Email',
    'auth.register.password': 'Mot de Passe',
    'auth.register.confirm_password': 'Confirmer le Mot de Passe',
    'auth.register.account_type': 'Type de Compte',
    'auth.register.user_desc': 'Parcourir et emprunter des livres',
    'auth.register.admin_desc': 'Gérer le système de bibliothèque',
    'auth.register.create_account': 'Créer un Compte',
    'auth.register.creating_account': 'Création du compte...',
    'auth.register.have_account': 'Vous avez déjà un compte ?',
    'auth.register.signin_here': 'Connectez-vous ici',
    'auth.errors.passwords_no_match': 'Les mots de passe ne correspondent pas',
    'auth.errors.password_too_short': 'Le mot de passe doit contenir au moins 6 caractères',

    // Books
    'books.title': 'Parcourir Notre Collection',
    'books.subtitle': 'Découvrez votre prochain livre favori dans notre vaste bibliothèque',
    'books.search_placeholder': 'Rechercher des livres par titre ou auteur...',
    'books.all_genres': 'Toutes',
    'books.available': 'disponible',
    'books.per_day': '/jour',
    'books.previous': 'Précédent',
    'books.next': 'Suivant',

    // Book Details
    'book.back_to_books': 'Retour aux Livres',
    'book.available_copies': 'Disponible',
    'book.daily_rate': 'Tarif Journalier',
    'book.description': 'Description',
    'book.isbn': 'ISBN',
    'book.added_by': 'Ajouté par',
    'book.borrow_title': 'Emprunter ce Livre',
    'book.borrowing_period': 'Période d\'Emprunt (jours)',
    'book.total_cost': 'Coût Total',
    'book.borrow_book': 'Emprunter le Livre',
    'book.login_to_borrow': 'Se Connecter pour Emprunter',
    'book.processing': 'Traitement en cours...',
    'book.unavailable': 'Actuellement Indisponible',
    'book.unavailable_desc': 'Tous les exemplaires de ce livre sont actuellement empruntés.',
    'book.success_message': 'Livre emprunté avec succès !',
    'book.not_found': 'Livre Non Trouvé',

    // Dashboard
    'dashboard.title': 'Mon Tableau de Bord',
    'dashboard.welcome': 'Bon retour, {{name}} !',
    'dashboard.active_borrowings': 'Emprunts Actifs',
    'dashboard.completed': 'Terminés',
    'dashboard.total_books': 'Total des Livres',
    'dashboard.total_fees': 'Frais Totaux',
    'dashboard.currently_borrowed': 'Livres Actuellement Empruntés',
    'dashboard.borrowed': 'Emprunté',
    'dashboard.due': 'Échéance',
    'dashboard.current_fee': 'Frais Actuels',
    'dashboard.late_fee': '+{{amount}} retard',
    'dashboard.return_book': 'Retourner le Livre',
    'dashboard.returning': 'Retour en cours...',
    'dashboard.borrowing_history': 'Historique des Emprunts',
    'dashboard.no_books_title': 'Aucun Livre Emprunté',
    'dashboard.no_books_desc': 'Commencez à explorer notre collection pour trouver votre prochaine lecture !',
    'dashboard.browse_books': 'Parcourir les Livres',
    'dashboard.returned': 'Retourné',
    'dashboard.status': 'Statut',
    'dashboard.fee': 'Frais',

    // Admin Panel
    'admin.title': 'Panneau d\'Administration',
    'admin.subtitle': 'Gérez votre système de bibliothèque',
    'admin.books': 'Livres',
    'admin.users': 'Utilisateurs',
    'admin.borrowings': 'Emprunts',
    'admin.books_management': 'Gestion des Livres',
    'admin.add_book': 'Ajouter un Livre',
    'admin.add_new_book': 'Ajouter un Nouveau Livre',
    'admin.title_field': 'Titre',
    'admin.author_field': 'Auteur',
    'admin.isbn_field': 'ISBN',
    'admin.total_copies': 'Exemplaires Totaux',
    'admin.daily_fee': 'Frais Journaliers',
    'admin.published_year': 'Année de Publication',
    'admin.cover_image_url': 'URL de l\'Image de Couverture',
    'admin.description_field': 'Description',
    'admin.cancel': 'Annuler',
    'admin.genre': 'Catégorie',
    'admin.copies': 'Exemplaires',
    'admin.actions': 'Actions',
    'admin.users_management': 'Gestion des Utilisateurs',
    'admin.user': 'Utilisateur',
    'admin.role': 'Rôle',
    'admin.member_since': 'Membre Depuis',
    'admin.borrowings_management': 'Gestion des Emprunts',
    'admin.book': 'Livre',

    // Common
    'common.loading': 'Chargement...',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.save': 'Sauvegarder',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.confirm_delete': 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.close': 'Fermer',
    'common.submit': 'Soumettre',
    'common.language': 'Langue',

    // genres
    'genre.fiction': 'Fiction',
    'genre.non_fiction': 'Non-Fiction',
    'genre.science': 'Science',
    'genre.technology': 'Technologie',
    'genre.history': 'Histoire',
    'genre.biography': 'Biographie',
    'genre.mystery': 'Mystère',
    'genre.romance': 'Romance',
    'genre.fantasy': 'Fantaisie',
    'genre.self_help': 'Développement Personnel',
    'genre.memoir': 'Mémoire',

    // Status
    'status.borrowed': 'Emprunté',
    'status.returned': 'Retourné',
    'status.overdue': 'En Retard',
    'status.active': 'Actif',
    'status.inactive': 'Inactif',

    // Roles
    'role.admin': 'Administrateur',
    'role.user': 'Utilisateur',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][key] || translations['en'][key] || key;

    // Handle parameter substitution
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{{${paramKey}}}`, String(paramValue));
      });
    }

    return translation;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};