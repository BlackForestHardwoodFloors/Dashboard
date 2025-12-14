import { useState } from 'react';
import { FileText, GraduationCap, TrendingUp, Search, ChevronRight, ChevronDown, AlertTriangle, Shield, Wind, Trash2, CheckCircle, Upload, Play } from 'lucide-react';

type SafetyView = 'main' | 'msds' | 'training' | 'growth';

export function SafetyGrowthScreen() {
  const [currentView, setCurrentView] = useState<SafetyView>('main');

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      paddingBottom: '100px'
    }}>
      {currentView === 'main' && <MainSafetyView onNavigate={setCurrentView} />}
      {currentView === 'msds' && <MSDSView onBack={() => setCurrentView('main')} />}
      {currentView === 'training' && <TrainingView onBack={() => setCurrentView('main')} />}
      {currentView === 'growth' && <GrowthView onBack={() => setCurrentView('main')} />}
    </div>
  );
}

function MainSafetyView({ onNavigate }: { onNavigate: (view: SafetyView) => void }) {
  const tiles = [
    {
      id: 'msds' as SafetyView,
      title: 'MSDS',
      description: 'Material Safety Data Sheets',
      icon: FileText,
      color: '#DC2626',
      bgGradient: 'linear-gradient(135deg, rgba(220,38,38,0.2) 0%, rgba(220,38,38,0.05) 100%)'
    },
    {
      id: 'training' as SafetyView,
      title: 'Training Modules',
      description: 'Learn & Improve Skills',
      icon: GraduationCap,
      color: '#0F7BFF',
      bgGradient: 'linear-gradient(135deg, rgba(15,123,255,0.2) 0%, rgba(15,123,255,0.05) 100%)'
    },
    {
      id: 'growth' as SafetyView,
      title: 'My Growth',
      description: 'Track Your Progress',
      icon: TrendingUp,
      color: '#4F6A41',
      bgGradient: 'linear-gradient(135deg, rgba(79,106,65,0.2) 0%, rgba(79,106,65,0.05) 100%)'
    }
  ];

  return (
    <>
      {/* Header */}
      <div style={{
        padding: '20px',
        backgroundColor: '#1A1A1A',
        borderBottom: '1px solid #2A2A2A',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h1 style={{
            color: '#FFFFFF',
            fontSize: '24px',
            fontWeight: '700',
            margin: 0
          }}>
            Safety & Growth
          </h1>
        </div>
      </div>

      {/* Tiles Grid */}
      <div style={{
        padding: '24px 20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '16px'
        }}>
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.id}
                onClick={() => onNavigate(tile.id)}
                style={{
                  padding: '28px 24px',
                  background: tile.bgGradient,
                  border: `2px solid ${tile.color}40`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  minHeight: '120px'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: tile.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 4px 16px ${tile.color}40`
                }}>
                  <Icon size={32} color="#FFFFFF" />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{
                    color: '#FFFFFF',
                    fontSize: '20px',
                    fontWeight: '700',
                    margin: '0 0 6px 0'
                  }}>
                    {tile.title}
                  </h3>
                  <p style={{
                    color: '#A0A0A0',
                    fontSize: '14px',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    {tile.description}
                  </p>
                </div>

                <ChevronRight size={24} color="#808080" />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function MSDSView({ onBack }: { onBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  const materials = [
    {
      id: '1',
      name: 'Bona Traffic HD',
      type: 'Finish',
      hazards: ['Flammable', 'Irritant'],
      description: 'Two-component waterborne finish for heavy traffic areas.',
      ppe: ['Safety glasses', 'Gloves', 'Respirator'],
      ventilation: 'Excellent ventilation required. Open windows and use fans.',
      disposal: 'Dispose of according to local regulations. Do not pour down drain.'
    },
    {
      id: '2',
      name: 'Minwax Jacobean Stain',
      type: 'Stain',
      hazards: ['Flammable', 'Harmful Vapors'],
      description: 'Oil-based wood stain for interior applications.',
      ppe: ['Safety glasses', 'Gloves', 'Respirator with organic vapor cartridge'],
      ventilation: 'Use in well-ventilated area. Avoid breathing vapors.',
      disposal: 'Dispose of rags in water-filled metal container. Take to hazardous waste facility.'
    },
    {
      id: '3',
      name: 'Sika T-55 Adhesive',
      type: 'Adhesive',
      hazards: ['Irritant', 'Sensitizer'],
      description: 'Premium urethane adhesive for wood flooring.',
      ppe: ['Safety glasses', 'Nitrile gloves'],
      ventilation: 'Adequate ventilation recommended.',
      disposal: 'Allow to cure completely before disposal in regular trash.'
    },
    {
      id: '4',
      name: 'Bona Pro Series Cleaner',
      type: 'Cleaner',
      hazards: ['Eye Irritant'],
      description: 'pH-neutral hardwood floor cleaner.',
      ppe: ['Safety glasses'],
      ventilation: 'Normal ventilation acceptable.',
      disposal: 'Can be disposed of down drain with plenty of water.'
    }
  ];

  const filteredMaterials = materials.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedMaterial) {
    const material = materials.find(m => m.id === selectedMaterial)!;
    
    return (
      <>
        <div style={{
          padding: '20px',
          backgroundColor: '#1A1A1A',
          borderBottom: '1px solid #2A2A2A',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <button
              onClick={() => setSelectedMaterial(null)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#D4A024',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: 0
              }}
            >
              ← Back to MSDS List
            </button>
            <h2 style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: '700',
              margin: 0
            }}>
              {material.name}
            </h2>
          </div>
        </div>

        <div style={{
          padding: '20px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: '#1F1F1F',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #2A2A2A'
          }}>
            {/* Material Type */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #2A2A2A'
            }}>
              <div style={{
                color: '#808080',
                fontSize: '12px',
                fontWeight: '700',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Material Type
              </div>
              <div style={{
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                {material.type}
              </div>
            </div>

            {/* Safety Warnings */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #2A2A2A',
              backgroundColor: 'rgba(220,38,38,0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <AlertTriangle size={20} color="#DC2626" />
                <div style={{
                  color: '#DC2626',
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Hazards
                </div>
              </div>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {material.hazards.map((hazard, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#DC2626',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}
                  >
                    {hazard}
                  </div>
                ))}
              </div>
            </div>

            {/* PPE Required */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #2A2A2A'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <Shield size={18} color="#4F6A41" />
                <div style={{
                  color: '#4F6A41',
                  fontSize: '13px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  PPE Required
                </div>
              </div>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                color: '#E0E0E0',
                fontSize: '14px',
                lineHeight: '1.8'
              }}>
                {material.ppe.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Ventilation */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #2A2A2A'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <Wind size={18} color="#0F7BFF" />
                <div style={{
                  color: '#0F7BFF',
                  fontSize: '13px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Ventilation
                </div>
              </div>
              <p style={{
                margin: 0,
                color: '#E0E0E0',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                {material.ventilation}
              </p>
            </div>

            {/* Disposal */}
            <div style={{
              padding: '16px 20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <Trash2 size={18} color="#E87722" />
                <div style={{
                  color: '#E87722',
                  fontSize: '13px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Disposal
                </div>
              </div>
              <p style={{
                margin: 0,
                color: '#E0E0E0',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                {material.disposal}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{
        padding: '20px',
        backgroundColor: '#1A1A1A',
        borderBottom: '1px solid #2A2A2A',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#D4A024',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '12px',
              padding: 0
            }}
          >
            ← Back
          </button>
          
          <h2 style={{
            color: '#FFFFFF',
            fontSize: '20px',
            fontWeight: '700',
            margin: '0 0 16px 0'
          }}>
            MSDS Library
          </h2>

          {/* Search Bar */}
          <div style={{
            position: 'relative'
          }}>
            <Search
              size={18}
              color="#808080"
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 44px',
                backgroundColor: '#252525',
                border: '1px solid #3A3A3A',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '15px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      <div style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {filteredMaterials.map((material) => (
            <button
              key={material.id}
              onClick={() => setSelectedMaterial(material.id)}
              style={{
                backgroundColor: '#1F1F1F',
                border: '1px solid #2A2A2A',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{
                  flex: 1
                }}>
                  <h3 style={{
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '700',
                    margin: '0 0 6px 0'
                  }}>
                    {material.name}
                  </h3>
                  
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    backgroundColor: '#4F6A41',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    {material.type}
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap'
                  }}>
                    {material.hazards.map((hazard, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#DC2626',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        <AlertTriangle size={12} />
                        {hazard}
                      </div>
                    ))}
                  </div>
                </div>

                <ChevronRight size={20} color="#808080" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function TrainingView({ onBack }: { onBack: () => void }) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'installation',
      name: 'Installation',
      color: '#4F6A41',
      modules: [
        { id: '1', title: 'Subfloor Preparation', level: 'Level 1-3', completed: true },
        { id: '2', title: 'Hardwood Acclimation', level: 'Level 1-2', completed: true },
        { id: '3', title: 'Nail-Down Installation', level: 'Level 2-5', completed: false }
      ]
    },
    {
      id: 'sand-finish',
      name: 'Sand & Finish',
      color: '#55624C',
      modules: [
        { id: '4', title: 'Sanding Techniques', level: 'Level 3-7', completed: false },
        { id: '5', title: 'Stain Application', level: 'Level 4-8', completed: false }
      ]
    },
    {
      id: 'repairs',
      name: 'Repairs',
      color: '#6B8E65',
      modules: [
        { id: '6', title: 'Plank Replacement', level: 'Level 2-4', completed: true }
      ]
    },
    {
      id: 'safety',
      name: 'Safety',
      color: '#DC2626',
      modules: [
        { id: '7', title: 'PPE Requirements', level: 'Level 1', completed: true },
        { id: '8', title: 'Tool Safety', level: 'Level 1-2', completed: true }
      ]
    }
  ];

  return (
    <>
      <div style={{
        padding: '20px',
        backgroundColor: '#1A1A1A',
        borderBottom: '1px solid #2A2A2A',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#D4A024',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '12px',
              padding: 0
            }}
          >
            ← Back
          </button>
          
          <h2 style={{
            color: '#FFFFFF',
            fontSize: '20px',
            fontWeight: '700',
            margin: 0
          }}>
            Training Modules
          </h2>
        </div>
      </div>

      <div style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {categories.map((category) => {
            const isExpanded = expandedCategory === category.id;
            
            return (
              <div key={category.id}>
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                  style={{
                    width: '100%',
                    backgroundColor: '#1F1F1F',
                    border: `2px solid ${category.color}`,
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '3px',
                      backgroundColor: category.color
                    }} />
                    <span style={{
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: '700'
                    }}>
                      {category.name}
                    </span>
                    <span style={{
                      color: '#808080',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      ({category.modules.length})
                    </span>
                  </div>
                  
                  {isExpanded ? (
                    <ChevronDown size={20} color="#FFFFFF" />
                  ) : (
                    <ChevronRight size={20} color="#808080" />
                  )}
                </button>

                {isExpanded && (
                  <div style={{
                    marginTop: '8px',
                    marginLeft: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {category.modules.map((module) => (
                      <div
                        key={module.id}
                        style={{
                          backgroundColor: '#252525',
                          border: '1px solid #2A2A2A',
                          borderRadius: '10px',
                          padding: '14px 16px'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          marginBottom: '12px'
                        }}>
                          {module.completed ? (
                            <CheckCircle size={20} color="#4F6A41" />
                          ) : (
                            <Play size={20} color="#0F7BFF" />
                          )}
                          
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              color: '#FFFFFF',
                              fontSize: '15px',
                              fontWeight: '700',
                              margin: '0 0 4px 0'
                            }}>
                              {module.title}
                            </h4>
                            <div style={{
                              color: '#808080',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {module.level}
                            </div>
                          </div>
                        </div>

                        {!module.completed && (
                          <button
                            style={{
                              width: '100%',
                              padding: '10px',
                              backgroundColor: '#0F7BFF',
                              border: 'none',
                              borderRadius: '8px',
                              color: '#FFFFFF',
                              fontSize: '13px',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            Start Module
                          </button>
                        )}

                        {module.completed && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#4F6A41',
                            fontSize: '13px',
                            fontWeight: '700'
                          }}>
                            <CheckCircle size={16} />
                            Completed
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function GrowthView({ onBack }: { onBack: () => void }) {
  const employeeData = {
    name: 'Mike Rodriguez',
    initials: 'MR',
    currentLevel: 3,
    levelTitle: 'Installation Specialist',
    nextLevel: 4,
    nextLevelTitle: 'Senior Installer',
    skillsCompleted: 12,
    skillsRequired: 18,
    lastReviewScore: 4.6,
    performanceTrend: '+12%'
  };

  const skills = [
    { name: 'Subfloor Prep', progress: 100, color: '#4F6A41' },
    { name: 'Nail-Down Install', progress: 90, color: '#4F6A41' },
    { name: 'Glue-Down Install', progress: 75, color: '#D4A024' },
    { name: 'Stair Installation', progress: 40, color: '#E87722' },
    { name: 'Sanding', progress: 20, color: '#DC2626' },
    { name: 'Finishing', progress: 15, color: '#DC2626' }
  ];

  return (
    <>
      <div style={{
        padding: '20px',
        backgroundColor: '#1A1A1A',
        borderBottom: '1px solid #2A2A2A',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#D4A024',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '12px',
              padding: 0
            }}
          >
            ← Back
          </button>
          
          <h2 style={{
            color: '#FFFFFF',
            fontSize: '20px',
            fontWeight: '700',
            margin: 0
          }}>
            My Growth
          </h2>
        </div>
      </div>

      <div style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {/* Profile Card */}
        <div style={{
          backgroundColor: 'linear-gradient(135deg, #1F1F1F 0%, #2A2A2A 100%)',
          border: '2px solid #4F6A41',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#4F6A41',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 auto 16px',
            border: '3px solid #D4A024'
          }}>
            {employeeData.initials}
          </div>

          <h3 style={{
            color: '#FFFFFF',
            fontSize: '20px',
            fontWeight: '700',
            margin: '0 0 8px 0'
          }}>
            {employeeData.name}
          </h3>

          <div style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#4F6A41',
            borderRadius: '20px',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            Level {employeeData.currentLevel} - {employeeData.levelTitle}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginTop: '20px'
          }}>
            <div>
              <div style={{
                color: '#808080',
                fontSize: '12px',
                fontWeight: '700',
                marginBottom: '4px',
                textTransform: 'uppercase'
              }}>
                Skills Progress
              </div>
              <div style={{
                color: '#FFFFFF',
                fontSize: '24px',
                fontWeight: '700'
              }}>
                {employeeData.skillsCompleted}/{employeeData.skillsRequired}
              </div>
            </div>
            
            <div>
              <div style={{
                color: '#808080',
                fontSize: '12px',
                fontWeight: '700',
                marginBottom: '4px',
                textTransform: 'uppercase'
              }}>
                Last Review
              </div>
              <div style={{
                color: '#D4A024',
                fontSize: '24px',
                fontWeight: '700'
              }}>
                {employeeData.lastReviewScore}
              </div>
            </div>
          </div>
        </div>

        {/* Next Level Card */}
        <div style={{
          backgroundColor: '#1F1F1F',
          border: '1px solid #2A2A2A',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h4 style={{
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: '700',
            margin: '0 0 12px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <TrendingUp size={18} color="#D4A024" />
            Next Level Progress
          </h4>
          
          <p style={{
            color: '#A0A0A0',
            fontSize: '14px',
            margin: '0 0 16px 0'
          }}>
            Complete {employeeData.skillsRequired - employeeData.skillsCompleted} more skills to reach Level {employeeData.nextLevel}
          </p>

          <div style={{
            height: '10px',
            backgroundColor: '#2A2A2A',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${(employeeData.skillsCompleted / employeeData.skillsRequired) * 100}%`,
              background: 'linear-gradient(90deg, #4F6A41 0%, #D4A024 100%)',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>

        {/* Skills List */}
        <h4 style={{
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: '700',
          margin: '0 0 12px 0'
        }}>
          Skill Development
        </h4>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {skills.map((skill, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#1F1F1F',
                border: '1px solid #2A2A2A',
                borderRadius: '10px',
                padding: '14px 16px'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  {skill.name}
                </span>
                <span style={{
                  color: skill.color,
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  {skill.progress}%
                </span>
              </div>

              <div style={{
                height: '6px',
                backgroundColor: '#2A2A2A',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${skill.progress}%`,
                  backgroundColor: skill.color,
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
