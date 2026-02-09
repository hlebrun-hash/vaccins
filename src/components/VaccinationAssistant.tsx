"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, User, Calendar, Baby, Syringe, ShieldCheck, ExternalLink, Info, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import KineticDotsLoader from "@/components/ui/kinetic-dots-loader";
import { Input } from "@/components/ui/input";

type Sex = "male" | "female" | null;

interface Recommendation {
    vaccine: string;
    reason: string;
    description?: string; // New: Detailed description for accordion
    urgent?: boolean;
    pharmacistPrescribable?: boolean;
}

const RecommendationItem = ({ rec, index }: { rec: Recommendation, index: number }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setIsOpen(!isOpen)}
            className="group cursor-pointer select-none"
        >
            <div className="flex gap-4 items-start">
                <div className={cn(
                    "mt-1 min-w-[32px] h-[32px] rounded-full flex items-center justify-center transition-colors duration-300",
                    rec.urgent ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                )}>
                    <Syringe className="w-4 h-4" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-slate-800 text-lg leading-tight group-hover:text-emerald-600 transition-colors">
                            {rec.vaccine}
                        </h3>
                        {rec.description && (
                            <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                className="text-slate-300 group-hover:text-emerald-400 transition-colors mt-0.5"
                            >
                                <ChevronDown className="w-5 h-5" />
                            </motion.div>
                        )}
                    </div>
                    <p className="text-slate-500 text-sm mt-1 font-medium">{rec.reason}</p>

                    <AnimatePresence>
                        {isOpen && rec.description && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <p className="text-slate-600 text-sm mt-3 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    {rec.description}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {rec.pharmacistPrescribable && (
                        <div className="inline-flex items-center gap-1.5 mt-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Dispo sans ordonnance médecin
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export const VaccinationAssistant = () => {
    const [age, setAge] = useState<number | "">("");
    const [sex, setSex] = useState<Sex>(null);
    const [isPregnant, setIsPregnant] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

    // Reset pregnancy if criteria changes
    useEffect(() => {
        if (sex !== "female" || (typeof age === "number" && age < 16)) {
            setIsPregnant(false);
        }
        setShowResult(false);
    }, [age, sex]);

    // "The Mistral Brain 2.0": Comprehensive French Vaccination Logic
    const calculateRecommendations = async () => {
        setIsLoading(true);
        // Simulate "thinking" time for the effect
        await new Promise(resolve => setTimeout(resolve, 1500));

        const recs: Recommendation[] = [];
        const numAge = Number(age);

        if (!age && age !== 0) return;

        // --- GROSSESSE (Priorité Absolue) ---
        if (isPregnant) {
            recs.push({
                vaccine: "Coqueluche",
                reason: "Priorité absolue : À faire entre 20 et 36 SA pour protéger le nouveau-né.",
                description: "La coqueluche est très dangereuse pour les nourrissons non vaccinés. En vous vaccinant pendant la grossesse, vous transmettez vos anticorps au bébé, le protégeant ainsi dès sa naissance jusqu'à sa propre vaccination.",
                urgent: true,
                pharmacistPrescribable: true
            });
            recs.push({
                vaccine: "Grippe (Saisonnière)",
                reason: "Indispensable si vous êtes enceinte pendant l'hiver (quel que soit le trimestre).",
                description: "La grossesse fragilise le système immunitaire. La grippe peut entraîner des complications respiratoires graves pour vous et des risques pour le bébé (prématurité). Le vaccin est sûr et recommandé.",
                urgent: true,
                pharmacistPrescribable: true
            });
            recs.push({
                vaccine: "Covid-19",
                reason: "Fortement recommandé (grossesse = facteur de risque).",
                description: "Les femmes enceintes ont plus de risques de développer une forme grave du Covid-19. La vaccination protège la mère et transmet des anticorps au fœtus.",
                pharmacistPrescribable: true
            });
            recs.push({
                vaccine: "Rappel DTP (si retard)",
                reason: "Possible, mais privilégier le vaccin combiné avec Coqueluche.",
                description: "Le rappel Diphtérie-Tétanos-Polio est essentiel. Si vous n'êtes pas à jour, il peut être fait pendant la grossesse, idéalement couplé avec le vaccin Coqueluche.",
                pharmacistPrescribable: true
            });
            // Note: ROR interdit
        }

        // --- NOURRISSONS & ENFANTS (0 - 10 ans) ---
        if (numAge <= 10) {
            recs.push({
                vaccine: "Calendrier Pédiatrique (11 Vaccins)",
                reason: "DTP, Coqueluche, Hib, Hep B, Pneumocoque, Men B, Men C, ROR.",
                description: "Depuis 2018, 11 vaccins sont obligatoires pour les enfants. Ils protègent contre des maladies potentiellement graves. Le suivi se fait lors des visites obligatoires chez le médecin.",
                urgent: true,
                pharmacistPrescribable: false // Need Doctor
            });

            if (numAge === 6) {
                recs.push({ vaccine: "Rappel 6 ans", reason: "DTP + Coqueluche (Indispensable avant le CP).", description: "Ce rappel est crucial avant l'entrée en école primaire pour maintenir l'immunité contre la Diphtérie, le Tétanos, la Polio et la Coqueluche.", pharmacistPrescribable: false });
            } else if (numAge < 2) {
                recs.push({ vaccine: "Méningocoque B & C", reason: "Plusieurs doses avant 12 mois.", description: "Les méningites sont des infections foudroyantes. La vaccination précoce protège les bébés contre les souches les plus fréquentes.", pharmacistPrescribable: false });
                recs.push({ vaccine: "ROR (Rougeole)", reason: "Dose 1 à 12 mois, Dose 2 à 16-18 mois.", description: "Le vaccin Rougeole-Oreillons-Rubéole est essentiel pour éradiquer ces maladies très contagieuses et éviter des complications neurologiques.", pharmacistPrescribable: false });
            }

            recs.push({ vaccine: "Grippe", reason: "Recommandé dès 6 mois si l'enfant est fragile (asthme, cœur...).", description: "Pour les enfants souffrant de maladies chroniques (asthme, diabète...), la grippe peut être très sévère. La vaccination annuelle est fortement conseillée.", pharmacistPrescribable: false });
        }

        // --- ADOLESCENTS (11 - 19 ans) ---
        if (numAge >= 11 && numAge <= 19) {
            recs.push({
                vaccine: "HPV (Gardasil 9)",
                reason: "Garçons et Filles : 2 doses entre 11-14 ans. Rattrapage (3 doses) jusqu'à 19 ans.",
                description: "Protège contre les Papillomavirus responsables de cancers (col de l'utérus, gorge, etc.) et de verrues génitales. Efficacité maximale si fait avant les premiers rapports.",
                urgent: true,
                pharmacistPrescribable: true
            });

            if (numAge >= 11 && numAge <= 13) {
                recs.push({
                    vaccine: "Rappel 11-13 ans",
                    reason: "DTP + Coqueluche (3ème rappel indispensable).",
                    description: "Rappel clé de l'adolescence pour réactiver la protection contre Diphtérie, Tétanos, Polio et Coqueluche, dont l'immunité baisse avec le temps.",
                    pharmacistPrescribable: true
                });
            }

            recs.push({
                vaccine: "Méningocoque ACWY",
                reason: "Recommandé (1 dose) chez l'adolescent (souvent vers 14 ans ou plus tard).",
                description: "Ce vaccin protège contre 4 souches de méningites (A, C, W, Y). Les ados et jeunes adultes sont une population à risque (vie en collectivité, échanges...).",
                pharmacistPrescribable: true
            });

            if (numAge >= 12) {
                recs.push({ vaccine: "Covid-19", reason: "Si fragile ou vivant avec des personnes fragiles.", description: "Empêche les formes graves. Particulièrement important si l'adolescent vit avec des grands-parents ou des personnes immunodéprimées.", pharmacistPrescribable: true });
            }
        }

        // --- ADULTES (20 - 64 ans) ---
        if (numAge >= 20 && numAge < 65 && !isPregnant) {
            // 25 ANS
            if (numAge >= 24 && numAge <= 26) {
                recs.push({ vaccine: "Rappel 25 ans", reason: "DTP + Coqueluche. Vérifier ROR (doit avoir eu 2 doses).", description: "Le rappel des 25 ans est LE grand rendez-vous de l'adulte jeune. Il contient DTP et Coqueluche (pour protéger les futurs bébés). C'est aussi le moment de vérifier si vous avez eu vos 2 doses de vaccin ROR dans l'enfance.", urgent: true, pharmacistPrescribable: true });
            }
            // 45 ANS
            else if (numAge >= 44 && numAge <= 46) {
                recs.push({ vaccine: "Rappel 45 ans", reason: "DTP + Coqueluche (si contact bébé) ou DTP seul.", description: "Rappel de mi-vie pour maintenir l'immunité tétanos/polio. La coqueluche est ajoutée si vous êtes en contact avec des nourrissons.", urgent: true, pharmacistPrescribable: true });
            }
            // ENTRE DEUX
            else {
                recs.push({ vaccine: "Suivi DTPolio", reason: "Rappels fixes : 25 ans, 45 ans. Êtes-vous à jour ?", description: "Chez l'adulte, les rappels sont désormais à âges fixes : 25 ans, 45 ans, puis 65 ans. Si vous avez raté le coche, un rattrapage est possible à tout moment.", pharmacistPrescribable: true });

                // Coqueluche Cocooning
                recs.push({ vaccine: "Coqueluche", reason: "À refaire si projet bébé ou contact avec un nourrisson.", description: "La coqueluche est grave pour les bébés avant 2 mois. La stratégie 'Cocooning' consiste à vacciner les parents et l'entourage proche pour ne pas contaminer le nouveau-né.", pharmacistPrescribable: true });
            }

            recs.push({ vaccine: "ROR (Rougeole)", reason: "Si né après 1980 : Vous devez avoir reçu 2 doses au total.", description: "Toute personne née après 1980 devrait avoir reçu deux doses de vaccin ROR (Rougeole-Oreillons-Rubéole) dans sa vie. Une simple prise de sang ou vérification du carnet permet de le savoir.", pharmacistPrescribable: true });
            recs.push({ vaccine: "Grippe / Covid", reason: "Recommandé chaque année si : Asthme, Diabète, Obésité, etc.", description: "Pour les personnes souffrant de maladies chroniques (ALD), la Grippe et le Covid peuvent décompenser la maladie. La vaccination annuelle vous protège des hospitalisations.", pharmacistPrescribable: true });
        }

        // --- SENIORS (65+ ans) ---
        if (numAge >= 65) {
            // 65 ANS
            if (numAge >= 65 && numAge <= 66) {
                recs.push({ vaccine: "Rappel 65 ans", reason: "DTPolio + Grippe + Covid (+ Pneumocoque si risque).", description: "Grand bilan vaccinal de la retraite. On remet à jour le Tétanos/Polio, et on vaccine contre les virus respiratoires saisonniers qui sont plus dangereux avec l'âge.", urgent: true, pharmacistPrescribable: true });
            } else {
                const isTenYear = (numAge - 65) % 10 === 0; // 75, 85, 95...
                if (isTenYear) {
                    recs.push({ vaccine: `Rappel ${numAge} ans`, reason: "DTPolio (tous les 10 ans désormais).", description: "Après 65 ans, l'immunité baisse plus vite. Le rappel Tétanos/Polio se fait donc tous les 10 ans (75, 85, 95...) au lieu de 20.", urgent: true, pharmacistPrescribable: true });
                } else {
                    recs.push({ vaccine: "Suivi DTPolio", reason: "Rappel tous les 10 ans après 65 ans (75, 85...)." });
                }
            }

            // ZONA
            if (numAge >= 65 && numAge <= 74) {
                recs.push({ vaccine: "Zona (Shingrix)", reason: "2 doses espacées de 2 à 6 mois. Fortement recommandé.", description: "Le Zona est une réactivation douloureuse du virus de la varicelle. Fréquent après 65 ans, il peut laisser des douleurs chroniques invalidantes. Le nouveau vaccin est très efficace.", pharmacistPrescribable: true });
            }

            // SAISONNIER
            recs.push({ vaccine: "Grippe Saisonnière", reason: "Chaque automne. Risque de complications élevé.", description: "Chaque année, le virus de la grippe mute. Le vaccin est mis à jour pour vous protéger l'hiver suivant. Gratuit et fortement recommandé après 65 ans.", urgent: true, pharmacistPrescribable: true });
            recs.push({ vaccine: "Covid-19", reason: "Rappel annuel (automne) vivement conseillé.", description: "Comme pour la grippe, une dose de rappel annuelle permet de rebooster vos anticorps et d'éviter les formes graves, surtout en hiver.", urgent: true, pharmacistPrescribable: true });

            // PNEUMO
            recs.push({ vaccine: "Pneumocoque", reason: "Discutez-en : recommandé si insuffisance respiratoire/cardiaque.", description: "Le pneumocoque provoque des pneumonies sévères. Si vous avez une maladie chronique ou une baisse d'immunité, ce vaccin (souvent vaccin Prevenar 13 + Pneumovax) est vital.", pharmacistPrescribable: true });
        }

        // --- AUTRES VACCINS & RATTRAPAGES CIBLÉS ---

        // Hépatite B : Rattrapage général uniquement jusqu'à 15 ans
        if (numAge >= 11 && numAge <= 15) {
            recs.push({
                vaccine: "Hépatite B",
                reason: "Rattrapage possible et remboursé jusqu'à 15 ans.",
                description: "Ce vaccin est recommandé pour tous les nourrissons. Si non fait, le rattrapage facile est possible jusqu'à 15 ans révolus. Au-delà, il est réservé aux personnes à risque.",
                pharmacistPrescribable: true
            });
        }

        // Méningocoque C : Rattrapage jusqu'à 24 ans
        if (numAge >= 11 && numAge <= 24) {
            recs.push({
                vaccine: "Méningocoque C",
                reason: "Rattrapage recommandé jusqu'à 24 ans révolus.",
                description: "Les adolescents et jeunes adultes sont les principaux porteurs. Le rattrapage est une dose unique indispensable jusqu'à 24 ans.",
                pharmacistPrescribable: true
            });
        }

        // Méningocoques B & ACWY (HAS 2024/2025) : Recommandés chez l'adolescent/jeune adulte
        if (numAge >= 11 && numAge <= 24) {
            recs.push({
                vaccine: "Méningocoques ACWY / B",
                reason: "Nouvelles recos HAS : Adolescents et Jeunes Adultes.",
                description: "Pour casser les chaînes de transmission, la HAS recommande désormais d'élargir la protection contre les méningites ACWY et B aux adolescents et jeunes adultes.",
                pharmacistPrescribable: true
            });
        }

        // Varicelle : Pour adultes sans antécédent (sauf grossesse)
        if (numAge >= 12 && !isPregnant) {
            recs.push({
                vaccine: "Varicelle",
                reason: "Si vous n'avez JAMAIS eu la varicelle.",
                description: "Si vous êtes certain(e) de n'avoir jamais eu la varicelle (une prise de sang peut le confirmer), la vaccination est recommandée pour éviter les formes graves de l'adulte.",
                pharmacistPrescribable: true
            });
        }

        // ROR : Rattrapage pour nés après 1980 (si pas déjà couvert plus haut)
        if (numAge > 24 && numAge <= 46 && !isPregnant) {
            // On vérifie si ROR n'a pas déjà été ajouté par le bloc "Adulte" principal
            const rorExists = recs.some(r => r.vaccine.includes("ROR"));
            if (!rorExists) {
                recs.push({
                    vaccine: "ROR (Rougeole)",
                    reason: "Si né après 1980 : vérifier vos 2 doses.",
                    description: "Objectif éradication : toute personne née après 1980 doit avoir reçu 2 doses de ROR dans sa vie, quel que soit l'intervalle.",
                    pharmacistPrescribable: true
                });
            }
        }

        // Note : Hépatite A, Rage, Typhoïde sont des vaccins "Voyage" ou "Risque Pro".
        // Ils ne sont pas affichés par défaut pour respecter le critère "Lien avec le profil".

        // Tri des recommandations : "Urgent" (Orange) en premier
        const sortedRecs = [...recs].sort((a, b) => {
            if (a.urgent && !b.urgent) return -1;
            if (!a.urgent && b.urgent) return 1;
            return 0;
        });

        setRecommendations(sortedRecs);
        setShowResult(true);
        setIsLoading(false);
    };

    const showPregnancyCheckbox = sex === "female" && typeof age === "number" && age >= 16;
    const canSubmit = age !== "" && sex !== null;

    return (
        <div className="w-full max-w-md mx-auto p-4 md:p-0">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center justify-center min-h-[400px]"
                    >
                        <KineticDotsLoader />
                        <p className="text-slate-500 font-medium mt-4 animate-pulse">
                            Analyse de votre profil...
                        </p>
                    </motion.div>
                ) : !showResult ? (
                    <motion.div
                        key="input-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-slate-100"
                    >
                        <div className="text-center space-y-4 mb-8">
                            <h1 className="text-2xl font-bold text-slate-900">
                                Vaccin de la pharmacie du marché
                            </h1>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Faites le point sur votre santé, l'esprit tranquille. En quelques secondes, vérifiez si vous ou vos proches êtes à jour, selon le calendrier officiel français.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Age Input */}
                            {/* Age Input using new Animated Component */}
                            <div className="pt-2">
                                <Input
                                    label="Votre âge"
                                    icon={<Calendar className="w-4 h-4 text-emerald-500" />}
                                    value={age === "" ? "" : String(age)}
                                    type="number"
                                    onChange={(e) => {
                                        const val = e.target.value ? Number(e.target.value) : "";
                                        if (typeof val === "number" && val > 150) return; // Basic sanity check
                                        setAge(val);
                                    }}
                                    className="border-slate-300 text-slate-800 focus:border-emerald-500"
                                />
                            </div>

                            {/* Sex Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <User className="w-4 h-4 text-emerald-500" />
                                    Sexe
                                </label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setSex("female")}
                                        className={cn(
                                            "flex-1 p-4 rounded-2xl border-2 transition-all duration-300 flex justify-center items-center gap-2 text-sm font-bold",
                                            sex === "female"
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md"
                                                : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-slate-50"
                                        )}
                                    >
                                        {sex === "female" && <Check className="w-4 h-4" />}
                                        Femme
                                    </button>
                                    <button
                                        onClick={() => setSex("male")}
                                        className={cn(
                                            "flex-1 p-4 rounded-2xl border-2 transition-all duration-300 flex justify-center items-center gap-2 text-sm font-bold",
                                            sex === "male"
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md"
                                                : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-slate-50"
                                        )}
                                    >
                                        {sex === "male" && <Check className="w-4 h-4" />}
                                        Homme
                                    </button>
                                </div>
                            </div>

                            {/* Progressive Disclosure: Pregnancy */}
                            <AnimatePresence>
                                {showPregnancyCheckbox && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div
                                            onClick={() => setIsPregnant(!isPregnant)}
                                            className={cn(
                                                "p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-colors",
                                                isPregnant
                                                    ? "bg-emerald-50 border-emerald-200"
                                                    : "bg-slate-50 border-transparent hover:bg-slate-100"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                                                    isPregnant
                                                        ? "bg-emerald-500 border-emerald-500"
                                                        : "border-slate-300 bg-white"
                                                )}
                                            >
                                                {isPregnant && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className="text-slate-700 font-medium flex items-center gap-2">
                                                <Baby className="w-4 h-4 text-emerald-500" /> Je suis enceinte
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Action Button */}
                        <button
                            disabled={!canSubmit}
                            onClick={calculateRecommendations}
                            className={cn(
                                "w-full py-4 rounded-2xl text-white font-semibold text-lg shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[60px]",
                                "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
                            )}
                        >
                            Voir mes vaccins
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full"
                    >
                        {/* The Pharmacy Pass Card */}
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="bg-white/95 backdrop-blur-md rounded-[32px] shadow-2xl overflow-hidden border-2 border-emerald-200 relative transition-all duration-500"
                        >
                            {/* Header Strip */}
                            <div className="h-3 w-full bg-emerald-400" />

                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Mémmo Vaccin</h2>
                                        <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black mt-1">Pass Santé Personnel</p>
                                    </div>
                                    <div className="p-2.5 rounded-2xl bg-emerald-50 shadow-inner">
                                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                    </div>
                                </div>

                                {/* Profile Summary Badge */}
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                                        <Calendar className="w-3 h-3" />
                                        {age} ans
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200 uppercase">
                                        <User className="w-3 h-3" />
                                        {sex === "female" ? "Femme" : "Homme"}
                                    </div>
                                    {isPregnant && (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                                            <Baby className="w-3 h-3" />
                                            Enceinte
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 my-8">
                                    {recommendations.length > 0 ? (
                                        recommendations.map((rec, i) => (
                                            <RecommendationItem key={i} rec={rec} index={i} />
                                        ))
                                    ) : (
                                        <div className="text-slate-500 text-center py-4">
                                            Vous semblez être à jour pour les rappels principaux standards.
                                            <br />Vérifiez simplement votre carnet.
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-dashed border-slate-200">
                                    <div className="rounded-2xl p-5 text-center font-medium bg-gradient-to-br from-emerald-50 to-white text-emerald-900 border border-emerald-100/50">
                                        <div className="inline-flex items-center gap-2 mb-1 text-emerald-600">
                                            <Info className="w-4 h-4" />
                                            <span className="text-xs font-black uppercase tracking-widest">Conseil Pharmacie</span>
                                        </div>
                                        <br />
                                        <span className="font-bold text-sm">Votre pharmacien saura exactement quoi faire en voyant cette liste.</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="mt-6 flex flex-col gap-3">
                            <button
                                onClick={() => setShowResult(false)}
                                className="w-full text-slate-500 hover:text-slate-800 text-sm font-medium py-2"
                            >
                                Faire une nouvelle simulation
                            </button>
                        </div>

                        {/* Disclaimer & Source */}
                        <div className="mt-8 text-center space-y-4">
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-slate-50 px-2 text-slate-400 font-semibold">Source Officielle</span>
                                </div>
                            </div>

                            <p className="text-xs text-slate-400 italic max-w-sm mx-auto leading-relaxed">
                                Cette simulation est basée sur le calendrier vaccinal général français en vigueur.
                                Seul un professionnel de santé peut valider votre statut vaccinal complet en fonction de vos antécédents médicaux personnels.
                            </p>

                            <div className="flex flex-col gap-2 items-center">
                                <a
                                    href="https://www.service-public.fr/particuliers/vosdroits/F704"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-emerald-600 font-bold text-xs hover:text-emerald-700 transition-colors p-2 bg-emerald-50/50 rounded-lg hover:bg-emerald-50 w-fit"
                                >
                                    Service-Public.fr (Calendrier Officiel)
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                                <a
                                    href="https://www.has-sante.fr/jcms/p_3511874/fr/la-has-propose-une-nouvelle-strategie-de-vaccination-contre-les-meningocoques"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-emerald-600 font-bold text-xs hover:text-emerald-700 transition-colors p-2 bg-emerald-50/50 rounded-lg hover:bg-emerald-50 w-fit"
                                >
                                    HAS - Recos Méningocoques B & ACWY (2024)
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                                <a
                                    href="https://sante.gouv.fr/prevention-en-sante/preserver-sa-sante/vaccination/calendrier-vaccinal"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-emerald-600 font-bold text-xs hover:text-emerald-700 transition-colors p-2 bg-emerald-50/50 rounded-lg hover:bg-emerald-50 w-fit"
                                >
                                    Ministère de la Santé (Calendrier 2024/2025)
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>

                            <p className="text-[10px] text-slate-300 mt-4 leading-relaxed">
                                Mis à jour pour le calendrier vaccinal {new Date().getFullYear()}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


        </div >
    );
};
