/**
 * DASHBOARD SCREEN (Capa de Presentación / Smart Component)
 * * Este componente orquesta la experiencia principal del usuario.
 * * Aspectos Senior implementados:
 * 1. Reactividad basada en Consultas (Q.where): Las tareas se filtran a nivel de 
 * base de datos (SQLite), no en memoria de JS, optimizando el rendimiento.
 * 2. LayoutAnimation: Implementa transiciones fluidas de 60 FPS al filtrar o 
 * editar elementos de la UI.
 * 3. Integración Nativa Dinámica: El componente 'AvatarView' reacciona en tiempo 
 * real al cambio de nombre del usuario procesado en el hilo nativo.
 */

import React, { useEffect, useState } from 'react';
import { 
  View, FlatList, Text, StyleSheet, SafeAreaView, 
  TouchableOpacity, StatusBar, RefreshControl,
  LayoutAnimation, Platform, UIManager, TextInput
} from 'react-native';
import { database } from '../database/index';
import Task from '../database/Task';
import { Q } from '@nozbe/watermelondb';
import type { Clause } from '@nozbe/watermelondb/QueryDescription';
import withObservables from '@nozbe/with-observables';
import TaskItem from '../components/TaskItem';
import { AvatarView } from '../components/AvatarView'; 
import { useUiStore } from '../store/useUiStore'; 
import { useTasks } from '../hooks/useTasks';

// Habilita animaciones de diseño nativas en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FilterType = 'all' | 'pending' | 'completed';

const Dashboard = ({ tasks, filter, setFilter, isSyncing, handleRefresh }: any) => {
  const { userName, setUserName } = useUiStore();
  const [tempName, setTempName] = useState(userName);
  const [isEditing, setIsEditing] = useState(!userName);

  /**
   * LayoutAnimation: Proporciona feedback visual senior al realizar cambios en 
   * la estructura de la lista o estados de edición.
   */
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [tasks.length, filter, isEditing]);

  /**
   * Sincronización Inicial: Se dispara al montar el componente para asegurar
   * que los 150 registros requeridos estén presentes en la base de datos local.
   */
  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const saveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setIsEditing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER DINÁMICO: Gestión de identidad del usuario */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          {isEditing ? (
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu nombre..."
                value={tempName}
                onChangeText={setTempName}
                autoFocus
                onSubmitEditing={saveName}
              />
              <TouchableOpacity onPress={saveName} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>OK</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.welcome}>Bienvenido,</Text>
              <Text style={styles.name}>{userName}</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* COMPONENTE NATIVO: Integración directa con Kotlin/Swift */}
        <AvatarView name={userName || "User"} style={styles.avatar} />
      </View>

      {/* BARRA DE FILTROS: Implementación declarativa de estados de tarea */}
      <View style={styles.filterBar}>
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <TouchableOpacity 
            key={f}
            style={[styles.chip, filter === f && styles.chipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
              {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Hechas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTA REACTIVA: Renderizado eficiente de grandes volúmenes de datos */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskItem task={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={isSyncing} 
            onRefresh={handleRefresh} 
            tintColor="#6366F1" 
          />
        }
      />
    </SafeAreaView>
  );
};

/**
 * HOC - WITH OBSERVABLES:
 * * Transforma la consulta de la base de datos en una prop reactiva.
 * * Las cláusulas de filtrado (Q.where) aseguran que el motor SQLite haga 
 * el trabajo pesado, manteniendo el hilo de JS libre para la UI.
 */
const enhance = withObservables(['filter'], ({ filter }: { filter: FilterType }) => {
  const clauses: Clause[] = [];
  if (filter === 'pending') clauses.push(Q.where('completed', false));
  if (filter === 'completed') clauses.push(Q.where('completed', true));

  return {
    tasks: database.get<Task>('tasks').query(...clauses).observe(), 
  };
});

const EnhancedDashboard = enhance(Dashboard);

export const DashboardScreen = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const { isSyncing, handleRefresh } = useTasks();

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FE' }}>
      <EnhancedDashboard 
        filter={filter} 
        setFilter={setFilter}
        isSyncing={isSyncing}
        handleRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 25, 
    paddingTop: 20, 
    paddingBottom: 20, 
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4
  },
  welcome: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  name: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { 
    flex: 1, 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#0F172A',
    borderBottomWidth: 2,
    borderBottomColor: '#6366F1',
    marginRight: 10
  },
  saveBtn: { backgroundColor: '#6366F1', padding: 8, borderRadius: 8 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold' },
  filterBar: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginTop: 20, marginBottom: 10 },
  chip: { flex: 1, paddingVertical: 12, borderRadius: 16, backgroundColor: '#FFF', alignItems: 'center', elevation: 2 },
  chipActive: { backgroundColor: '#6366F1' },
  chipText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  chipTextActive: { color: '#FFF' },
  listContent: { paddingBottom: 40 }
});