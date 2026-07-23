<template>
  <main class="min-h-screen bg-neutral-bg p-4 text-neutral-text md:p-6">
    <header class="mb-6">
      <h1 class="txt-h4 text-neutral-text">Component Bento</h1>
      <p class="txt-caption text-neutral-text-subtle">
        Mini-scénarios interactifs pour se projeter dans l'utilisation des composants
      </p>
    </header>

    <PreviewBentoGrid>
      <PreviewModuleShell title="Connexion">
        <LoginScenario />
      </PreviewModuleShell>

      <PreviewModuleShell title="Préférences notifications">
        <NotificationPrefsScenario />
      </PreviewModuleShell>

      <PreviewModuleShell title="Objectif d'épargne">
        <SavingsGoalScenario />
      </PreviewModuleShell>

      <PreviewModuleShell title="Réglages volume">
        <VolumeSettingsScenario />
      </PreviewModuleShell>

      <PreviewModuleShell title="Code de vérification">
        <VerificationCodeScenario />
      </PreviewModuleShell>

      <PreviewModuleShell title="Suppression">
        <DeleteConfirmScenario />
      </PreviewModuleShell>

      <PreviewModuleShell title="Profil utilisateur">
        <ProfileScenario />
      </PreviewModuleShell>

      <PreviewModuleShell title="Téléversement document">
        <FileUploadScenario />
      </PreviewModuleShell>

      <PreviewModuleShell title="Parcours commande">
        <CheckoutStepsScenario />
      </PreviewModuleShell>

      <PreviewModuleShell title="Centre d'aide">
        <FaqScenario />
      </PreviewModuleShell>

      <PreviewModuleShell title="Partage d'accès">
        <ShareAccessScenario />
      </PreviewModuleShell>

      <PreviewModuleShell title="Actions document">
        <DocumentMenuScenario />
      </PreviewModuleShell>

      <PreviewModuleShell title="Liste paginée">
        <ListPaginationScenario />
      </PreviewModuleShell>

      <PreviewModuleShell title="Recherche et filtres">
        <SearchFiltersScenario />
      </PreviewModuleShell>

      <PreviewModuleShell title="Tableau de bord">
        <DashboardTabsScenario />
      </PreviewModuleShell>
    </PreviewBentoGrid>
  </main>
</template>
