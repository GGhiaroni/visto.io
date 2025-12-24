import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Inspection } from "../../types/inspection";

// Criamos estilos parecidos com CSS
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica", // Fontes padrão do PDF
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold", // Nota: Helvetica bold é nativo
    color: "#0F172A", // Slate-900
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B", // Slate-500
  },
  section: {
    margin: 10,
    padding: 10,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#F8FAFC", // Slate-50
    padding: 15,
    borderRadius: 8,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#334155",
  },
  statLabel: {
    fontSize: 10,
    color: "#94A3B8",
    textTransform: "uppercase",
  },
});

interface InspectionReportProps {
  data: Inspection;
}

// O Componente do PDF
export const InspectionReport = ({ data }: InspectionReportProps) => {
  // Recalculando stats simples aqui dentro pra exibir no PDF
  const totalItems = data.rooms.reduce((acc, r) => acc + r.items.length, 0);
  const issues = data.rooms.reduce(
    (acc, r) => acc + r.items.filter((i) => i.status === "issue").length,
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* CABEÇALHO / CAPA */}
        <View style={styles.header}>
          <Text style={styles.title}>Relatório de Vistoria</Text>
          <Text style={styles.subtitle}>ID: {data.id}</Text>
          <Text style={styles.subtitle}>
            Data: {new Date(data.date).toLocaleDateString("pt-BR")}
          </Text>
        </View>

        {/* DADOS DO IMÓVEL */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 10, color: "#64748B" }}>Imóvel</Text>
          <Text style={{ fontSize: 14, marginBottom: 5 }}>
            {data.propertyAddress}
          </Text>

          <Text style={{ fontSize: 10, color: "#64748B", marginTop: 10 }}>
            Cliente
          </Text>
          <Text style={{ fontSize: 14 }}>{data.clientName}</Text>
        </View>

        {/* ESTATÍSTICAS */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{data.rooms.length}</Text>
            <Text style={styles.statLabel}>Cômodos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalItems}</Text>
            <Text style={styles.statLabel}>Itens</Text>
          </View>
          <View style={styles.statBox}>
            <Text
              style={[
                styles.statValue,
                { color: issues > 0 ? "#DC2626" : "#334155" },
              ]}
            >
              {issues}
            </Text>
            <Text style={styles.statLabel}>Problemas</Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 10,
            color: "#94A3B8",
            textAlign: "center",
            marginTop: 50,
          }}
        >
          Gerado via visto.io
        </Text>
      </Page>
    </Document>
  );
};
