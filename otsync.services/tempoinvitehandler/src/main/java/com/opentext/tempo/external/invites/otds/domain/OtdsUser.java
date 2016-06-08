package com.opentext.tempo.external.invites.otds.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.opentext.otag.sdk.util.StringUtil.isNullOrEmpty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OtdsUser {

    private static final String FALSE = "false";
    private static final String TRUE = "true";
    public static final String FIRST_NAME_KEY = "givenName";
    public static final String LAST_NAME_KEY = "sn";
    private String userPartitionID;
    private String name;
    private String location;
    private OtdsCustomAttribute[] customAttributes;
    private OtdsAttribute[] values;

    public OtdsUser() {
    }

    public OtdsUser(String firstName, String lastName, String email, String partition, String password) {
        this.name = email;
        this.userPartitionID = partition;
        this.location = "ou=Root,ou=" + partition + ",ou=IdentityProviders,dc=identity,dc=opentext,dc=net";
        setAttributes(firstName, lastName, email, password);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        OtdsUser otdsUser = (OtdsUser) o;

        if (userPartitionID != null ? !userPartitionID.equals(otdsUser.userPartitionID) : otdsUser.userPartitionID != null)
            return false;
        if (name != null ? !name.equals(otdsUser.name) : otdsUser.name != null) return false;
        if (location != null ? !location.equals(otdsUser.location) : otdsUser.location != null) return false;
        // Probably incorrect - comparing Object[] arrays with Arrays.equals
        if (!Arrays.equals(customAttributes, otdsUser.customAttributes)) return false;
        // Probably incorrect - comparing Object[] arrays with Arrays.equals
        return Arrays.equals(values, otdsUser.values);

    }

    @Override
    public int hashCode() {
        int result = userPartitionID != null ? userPartitionID.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (location != null ? location.hashCode() : 0);
        result = 31 * result + Arrays.hashCode(customAttributes);
        result = 31 * result + Arrays.hashCode(values);
        return result;
    }

    private void setAttributes(String firstName, String lastName, String email, String password) {
        List<OtdsAttribute> values = new ArrayList<>(10);
        addIfNotEmpty(values, newOtdsAttribute(FIRST_NAME_KEY, firstName));
        addIfNotEmpty(values, newOtdsAttribute(LAST_NAME_KEY, lastName));
        addIfNotEmpty(values, newOtdsAttribute("mail", email));
        addIfNotEmpty(values, newOtdsAttribute("UserMustChangePasswordAtNextSignIn", FALSE));
        addIfNotEmpty(values, newOtdsAttribute("PasswordNeverExpires", TRUE));
        addIfNotEmpty(values, newOtdsAttribute("userPassword", password));
        this.values = values.toArray(new OtdsAttribute[values.size()]);
        customAttributes = new OtdsCustomAttribute[0];
    }

    public void setFirstName(String firstName) {
        replaceValue(FIRST_NAME_KEY, firstName);
    }

    public void setLastName(String lastName) {
        replaceValue(LAST_NAME_KEY, lastName);
    }

    private void replaceValue(String key, String firstName) {
        List<OtdsAttribute> valuesList = getValuesAsList();
        valuesList = new ArrayList<>(valuesList.stream()
                .filter(v -> !key.equals(v.getName())).collect(Collectors.toList()));
        addIfNotEmpty(valuesList, newOtdsAttribute(key, firstName));
        OtdsAttribute[] otdsAttributes = valuesList.toArray(new OtdsAttribute[valuesList.size()]);
        this.values = otdsAttributes;
    }

    private List<OtdsAttribute> getValuesAsList() {
        OtdsAttribute[] valuesArray = this.values;
        if (valuesArray == null) {
            return new ArrayList<>();
        }
        return new ArrayList<>(Arrays.asList(valuesArray));
    }

    private void addIfNotEmpty(List list, Object obj) {
        if (obj != null)
            list.add(obj);
    }

    private OtdsAttribute newOtdsAttribute(String name, String... values) {
        if (values == null || values.length == 0 || isNullOrEmpty(values[0]))
            return null;
        return new OtdsAttribute(name, values);
    }

    public String getUserPartitionID() {
        return userPartitionID;
    }

    public void setUserPartitionID(String userPartitionID) {
        this.userPartitionID = userPartitionID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public OtdsCustomAttribute[] getCustomAttributes() {
        return customAttributes;
    }

    public void setCustomAttributes(OtdsCustomAttribute[] customAttributes) {
        this.customAttributes = customAttributes;
    }

    public OtdsAttribute[] getValues() {
        return values;
    }

    public void setValues(OtdsAttribute[] values) {
        this.values = values;
    }


    @Override
    public String toString() {
        return "OtdsUser{" +
                "userPartitionID='" + userPartitionID + '\'' +
                ", name='" + name + '\'' +
                ", location='" + location + '\'' +
                ", customAttributes=" + Arrays.toString(customAttributes) +
                ", values=" + Arrays.toString(values) +
                '}';
    }

    public void replaceAttribute(String name, String value) {
        Optional<OtdsAttribute> attribute = findAttribute(name);
        if (attribute.isPresent()) {
            attribute.get().getValues()[0] = value;
        } else {
            appendAttribute(new OtdsAttribute(name, value));
        }
    }

    private synchronized OtdsAttribute appendAttribute(OtdsAttribute attribute) {
        List<OtdsAttribute> valuesList = Arrays.asList(this.values);
        valuesList.add(attribute);
        values = valuesList.toArray(new OtdsAttribute[valuesList.size()]);
        return attribute;
    }

    private Optional<OtdsAttribute> findAttribute(String name) {
        return Arrays.asList(this.values).stream().filter(a -> a.getName().equals(name)).findFirst();
    }
}
