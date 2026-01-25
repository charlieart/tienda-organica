
import csv

csv_content = """Nombre del producto,Descripción,Presentación,Precio,imagen src
PALO DE ARCO,ANTICANCERÍGENO ANTITUMORAL. AUMENTA EL SISTEMA INMUNOLÓGICO. PREVINIENDO EL CÁNCER.,—,S/. 40,palo-de-arco.jpg
DIABEXAN,EXCELENTE PARA REGULARIZAR LA GLUCOSA. MEJORA LA CIRCULACIÓN SANGUÍNEA.,—,S/. 25,diabexan.jpg
NEEM,AYUDA A ELIMINAR: 1. BACTERIAS 2.PARÁSITOS 3.HONGOS,—,S/. 35,neem.jpg
HIGAZAN PLUS,DESINFLAMA EL HÍGADO. ELIMINA ÁCIDO ÚRICO. ELIMINA INFECCIONES URINARIAS.,—,S/. 25,higazan-plus.jpg
PASUCILACA,IDEAL PARA PERSONAS DIABÉTICAS REGULARIZA LA GLUCOSA.,—,S/. 35,pasucilaca.jpg
YACÓN,ANTITUMORAL. ANTICANCERÍGENO. ELIMINA INFECCIONES URINARIAS. ANTIOXIDANTE.,—,S/. 35,yacon.jpg
ORTIGA NEGRA,AYUDA A MEJORAR LA DIGESTIÓN. DISMINUYE EL GLUCOSA. TRATA LA AΝΕΜΙΑ.,—,S/. 25,ortiga-negra.jpg
GRAVIOLA,ANTITUMORAL. ANTICANCERÍGENO. EXCELENTE PARA DIABETES. ANTIINFLAMATORIO.,—,S/. 25,graviola.jpg
MUÉRDAGO,PREVIENE EL CÁNCER. REGULA LA TEMPERATURA...,—,S/. 50,muerdago.jpg
CHANCA PIEDRA,ELIMINA CÁLCULOS VESICULARES RENALES...,—,S/. 40,chanca-piedra.jpg
UBOS,IDEAL PARA INFECCIONES URINARIAS FEMENINAS.,—,S/. 40,ubos.jpg
CAMU CAMU,ANTIOXIDANTE. MEJORANDO EL SISTEMA NERVIOSO...,—,S/. 35,camu-camu.jpg
CURCUMA EN CAP,ANTIINFLAMATORIO. ANTIBIÓTICO.,—,S/. 40,curcuma-capsulas.jpg
AGUAJE,IDEAL PARA EQUILIBRAR EL SISTEMA HORMONAL.,—,S/. 35,aguaje.jpg
Naturel Maxxx,—,—,S/. 35,naturel-maxxx.jpg
Sacha MAXX Jergón,REFUERZA AL SISTEMA INMUNOLÓGICO.,—,S/. 40,sacha-maxx-jergon.jpg
CITRATO DE POTASIO,AYUDA A ELIMINAR EL EXCESO DE SAL Y LÍQUIDOS.,—,S/. 30,citrato-potasio.jpg
KALANCHOE CAPSULAS,SE USA PARA HERIDAS PROFUNDAS. INFECCIONES.,—,S/. 150,kalanchoe-capsulas.jpg
RESVERATROL,AYUDA AL CUERPO A COMBATIR ENFERMEDADES.,—,—,resveratrol.jpg
D3 CAP,ABSORBE EL CALCIO. FORMACIÓN DE HUESOS.,—,S/. 85,d3-cap.jpg
BIOTIN,AYUDA EN LA CAÍDA DE CABELLO Y CALVICIE.,—,S/. 85,biotin.jpg
SELENIUM CAP,MEJORA DE LA PRODUCCIÓN TIROIDEA.,—,S/. 85,selenium-cap.jpg
GLUCOSAMINE CAP,REPARADOR DEL CARTÍLAGO Y LÍQUIDO ARTICULAR.,—,S/. 85,glucosamine-cap.jpg
VITATRUM CAP,ABSORCIÓN DE MINERALES Y VITAMINAS.,—,S/. 85,vitatrum-cap.jpg
K2-D3 CAP,REGULA PRESIÓN ARTERIAL E INFLAMACIÓN.,—,S/. 250,k2-d3-cap.jpg
500 VIT C CAP,EXCELENTE ANTIOXIDANTE. SISTEMA INMUNE.,—,S/. 85,500-vit-c-cap.jpg
FISH OIL-OMEGA 3,REDUCE INFLAMACIÓN Y COLESTEROL.,—,S/. 85,fish-oil-omega3.jpg
ECHINACEA,ANTIBACTERIANO E INFECCIONES VÍRICAS.,—,S/. 220,echinacea.jpg
B12 CAP,PRODUCCIÓN DE GLÓBULOS ROJOS Y ENERGÍA.,—,S/. 150,b12-cap.jpg
ANTOCIANINAS,ANTIOXIDANTE. ANTIINFLAMATORIO.,—,S/. 185,antocianinas-compositum.jpg
ÁCIDO ALFA LIPOICO,ANTIOXIDANTE DE AMPLIO ESPECTRO.,—,S/. 185,acido-alfa-lipoico.jpg
CENTELLA ASIÁTICA,ESTIMULA PRODUCCIÓN DE COLÁGENO.,—,S/. 200,centella-asiatica.jpg
MELATONINA,PRODUCE UN SUEÑO REPARADOR.,—,S/. 85,melatonina-organica.jpg
MALATO MAGNESIO,AUMENTA ENERGÍA Y CONTROL DE GLUCOSA.,—,S/. 80,malato-magnesio.jpg
COLÁGENO FLEX,ABSORBE EL CALCIO REPARANDO CARTÍLAGOS.,—,S/. 40,colageno-flex-premium.jpg
MELENA DE LEÓN,ADAPTÓGENO PARA CÉLULAS ENFERMAS.,—,S/. 110,melena-de-leon.jpg
HE SHOUWU,REJUVENECE. ANTIOXIDANTE.,—,S/. 35,he-shouwu.jpg
CLOROFILA POLVO,OXIGENA LA SANGRE Y DESINTOXICA.,—,S/. 50,clorofila-polvo.jpg
JERGON SACHA,INFECCIONES VIRALES Y RESPIRATORIAS.,—,S/. 27,jergon-sacha.jpg
LINPOOL,ADELGAZANTE Y CONTROL DE APETITO.,—,S/. 25,linpool-adelgazante.jpg
CAFÉ GOURMET,CAFÉ ORGÁNICO IDEAL PARA ENEMAS.,—,S/. 38,cafe-gourmet-organico.jpg
SAL MARINA,EQUILIBRIO DE LÍQUIDOS Y ELECTROLITOS.,—,S/. 10,sal-marina.jpg
ACEITE DE COCO,MEJORA SISTEMA INMUNE Y DIGESTIÓN.,450 ml,S/. 40,aceite-coco.jpg
MIEL DE ABEJA,ANTIINFLAMATORIO Y ANTIBIÓTICO NATURAL.,—,S/. 25,miel-abeja.jpg
JABÓN CALENDULA,ELIMINA MANCHAS Y CICATRIZA.,—,S/. 20,jabon-calendula.jpg
TRIPLE MAGNESIUM,"SALUD DE NERVIOS, MÚSCULOS Y HUESOS.",—,S/. 180,triple-magnesium-complex.jpg"""

def generate_html(csv_text):
    lines = csv_text.strip().split('\n')
    header = lines[0].split(',')
    html_output = ""
    
    # Process lines correctly handling quotes
    reader = csv.reader(lines[1:])
    
    for i, row in enumerate(reader):
        name = row[0].strip()
        description = row[1].strip()
        # presentation = row[2] # Unused in grid card for now
        price = row[3].strip() if row[3].strip() != '—' else 'Consultar'
        image = row[4].strip()
        
        # Check if description is missing or placeholder
        if description == '—':
            description = "Producto natural seleccionado."

        html = f"""                        <!-- Producto {i+1}: {name} -->
                        <div class="group flex flex-col gap-4 bg-[#FBFAF8] p-4 rounded-3xl border border-[#27724e]/5 hover:border-[#27724e]/20 hover:shadow-xl transition-all duration-300">
                            <div class="relative overflow-hidden rounded-2xl aspect-[4/5] bg-white shadow-inner">
                                <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style='background-image: url("{image}");'></div>
                                <button class="absolute top-3 right-3 bg-white/80 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#D47253]">
                                    <span class="material-symbols-outlined text-sm">favorite</span>
                                </button>
                            </div>
                            <div class="flex flex-col flex-1 gap-1">
                                <div class="flex text-[#C5A059] text-[16px]">
                                    <span class="material-symbols-outlined text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-[16px]">star</span>
                                    <span class="text-xs text-[#27724e]/60 ml-1 pt-[2px]">(New)</span>
                                </div>
                                <h3 class="font-bold text-lg leading-tight group-hover:text-[#27724e] transition-colors text-[#27724e] uppercase">{name}</h3>
                                <p class="text-[#27724e]/70 text-xs mb-2 line-clamp-2" title="{description}">{description}</p>
                                <div class="mt-auto flex items-center justify-between pt-2">
                                    <span class="font-serif font-black text-xl text-[#27724e]">{price}</span>
                                    <button class="bg-[#27724e]/10 hover:bg-[#27724e] text-[#27724e] hover:text-white p-2.5 rounded-xl transition-all shadow-sm">
                                        <span class="material-symbols-outlined">add_shopping_cart</span>
                                    </button>
                                </div>
                            </div>
                        </div>
"""
        html_output += html + "\n"
    return html_output

print(generate_html(csv_content))
